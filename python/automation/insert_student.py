import sys
import pymysql
import csv
import pandas as pd
import numpy as np
import checkFile
import connect

def validateCSV(file_path, unique_id):
    needed_column = ['學號', '姓名', '班級', '年級', '性別', '入學身份', '在學身份', '在學狀況', 'eMail']
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

    #check student length == 7
    student_len = 7
    df['student_id_len'] = df['學號'].str.len()
    student_id_check = list(df['student_id_len']!=student_len)
    if True in student_id_check:
        record_status = 0
        error_student_id_count = len(df[df['student_id_len']!=student_len]['學號'].values)
        message = "錯誤：學號長度有誤 (可能為開頭缺少0) 共 : " + str(error_student_id_count) + "筆"
        validate_flag = False
        checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        return validate_flag
                 
    return validate_flag

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
            email varchar(50),
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
        drop temporary table temp_student;
    '''

    try:
        mycursor.execute(dump_sql1)
        mycursor.execute(dump_sql2.format(file_path))
        mycursor.execute(dump_sql3)
        affect_count = mycursor.rowcount
        mycursor.execute(dump_sql4)
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
    """./original/108student_new.csv"""
    file_path = sys.argv[1]
    global calling_file
    calling_file = __file__
    mycursor, connection = connect.connect2db()

    #Insert pending status (2) into database
    record_status = 2
    unique_id = checkFile.initialLog(calling_file, record_status, mycursor, connection)

    #Check csv file
    validate_flag = validateCSV(file_path, unique_id)

    if validate_flag == True:
        #Import this semester's on cos data
        record_status, code, message, affect_count = insertDB(file_path, mycursor, connection)
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
    mycursor.close()  ## here all loops done
    connection.close()  ## close db connection