import sys
import pymysql
import csv
import pandas as pd
import numpy as np
import checkFile
import connect
import os

def validateCSV(file_path, unique_id):
    needed_column = ['學號', '姓名', '班級', '性別', '入學身份', '在學身份', '在學狀況', 'eMail']
    record_status = 1
    validate_flag = True
    df = pd.read_csv(file_path, dtype={'學號': object})
    csv_column = df.keys().tolist()

    all_include = set(needed_column).issubset(csv_column)
    if all_include == False:
        record_status = 0
        error_column = str(set(needed_column) - set(csv_column))
        message = "錯誤：名稱有誤 : " + error_column
        validate_flag = False
        checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        return validate_flag

    #check student length == 7 or 9
    student_len = [7, 9]
    df['student_id_len'] = df['學號'].str.len()
    student_id_check = all(_ in student_len for _ in list(df['student_id_len']))
    if student_id_check == False:
        error_count = len(df[~df['student_id_len'].isin(student_len)])
        message = "錯誤：學號長度有誤 (可能為開頭缺少0) 共 : " + str(error_count) + "筆"
        validate_flag = False
        checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        return validate_flag

    return validate_flag

def convert_data(file_path):
    success_flag = True
    try:
        order = ['學號', '姓名', '班級', '年級', '性別', '入學身份', '在學身份', '在學狀況', 'eMail']
        df = pd.read_csv(file_path, dtype={'學號': object})
        df['年級'] = df['班級'].str[3]
        df['班級'] = df['班級'].str[4]
        df = df[order]

        output_path = os.getcwd() + "/temp_student.csv"
        df.to_csv(output_path, index = False, encoding = 'utf-8')
        return output_path, success_flag
    except:
        return None, False

def insertDB(file_path, mycursor, connection):
    record_status = None
    code = None
    message = None
    affect_count = None

    dump_sql1 = '''
        create temporary table temp_student(
            student_id varchar(10),
            sname varchar(50),
            program varchar(20),
            grade varchar(5),
            gender varchar(5),
            enroll_status varchar(20),
            now_status varchar(10),
            study_status varchar(10),
            email varchar(70),
            primary key(student_id)
        )DEFAULT CHARSET=utf8mb4;
    '''
    dump_sql2 = '''
        load data local infile '{}'
        into table temp_student
        character set 'utf8mb4'
        fields terminated by ','
        enclosed by '"'
        lines terminated by '\n'
        ignore 1 lines;
    '''
    dump_sql3 = '''
        insert into student (student_id, sname, program, grade, gender, enroll_status, now_status, study_status, email)
        select * from temp_student
        on duplicate key update
        sname = values(sname),
        program = values(program),
        grade = values(grade),
        gender = values(gender),
        enroll_status = values(enroll_status),
        now_status = values(now_status),
        study_status = values(study_status),
        email = values(email)
        ;
    '''
    dump_sql4 = '''
        update student
        set study_status = "畢業/休學/已離校"
        where student_id not in
        (
            select student_id
            from temp_student
        )
        and 
        (
            (
                study_status != "畢業"
                and study_status != "休學"
            )
            or study_status is NULL
        );
    '''
    dump_sql5 = '''
        drop temporary table temp_student;
    '''

    try:
        mycursor.execute(dump_sql1)
        mycursor.execute(dump_sql2.format(file_path))
        mycursor.execute(dump_sql3)
        affect_count = mycursor.rowcount
        mycursor.execute(dump_sql4)
        mycursor.execute(dump_sql5)
    except pymysql.InternalError as error:
        code, message = error.args
        record_status = 0
        connection.rollback()
    else:
        print('Success')
        connection.commit()
        record_status = 1

    return record_status, code, message, affect_count

def update_db_student_grad_rule_year(mycurser, connection):
    ## This function will update those student whose grad_rule_year attribute is NULL.
    ## The default value will be '1'+std_id[0]+std_id[1]

    record_status = None
    code = None
    message = None

    sql = '''
        update student 
        set grad_rule_year=convert(concat('1', substring(student_id, 1, 2)), SIGNED)
        where grad_rule_year is NULL;
    '''
    try:
        mycursor.execute(sql)
    except pymysql.InternalError as error:
        code, message = error.args
        record_status = 0
        connection.rollback()
    else:
        print('Success')
        connection.commit()
        record_status = 1

    return record_status, code, message

if __name__ == "__main__":
    """./original/108-2-student_new.csv"""
    file_path = sys.argv[1]
    year = file_path.split('/')[-1].split('-')[0]
    semester = file_path.split('/')[-1].split('-')[1]
    global calling_file
    calling_file = __file__
    mycursor, connection = connect.connect2db()

    #Insert pending status (2) into database
    record_status = 2
    unique_id = checkFile.initialLog(calling_file, record_status, year, semester, mycursor, connection)

    #Check csv file
    validate_flag = validateCSV(file_path, unique_id)

    if validate_flag == True:
        #Convert csv file
        output_pth, success_flag = convert_data(file_path)

        if success_flag:
            #Import this semester's on cos data
            record_status, code, message, affect_count = insertDB(output_pth, mycursor, connection)
            if record_status == 0:
                message = "匯入學生資料錯誤：" + message
                checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
            if record_status == 1:
                record_status, code, message = update_db_student_grad_rule_year(mycursor, connection)
                if record_status == 1:
                    message = "已匯入學生資料共 " + str(affect_count) + ' 筆'
                    checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
                else:
                    message = "更新學生畢業預審年度錯誤：" + message
                    checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
            try:
                os.remove(output_pth)
            except OSError as e:
                print(e)
        else:
            message = "匯入學生資料錯誤： 班級資料錯誤 (可能有特例學生，年級與組別皆需存在)"
            record_status = 0
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
    
    mycursor.close()  ## here all loops done
    connection.close()  ## close db connection

    