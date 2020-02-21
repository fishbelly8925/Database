import pymysql
import csv
import pandas as pd
import numpy as np
import checkFile
import connect

def validateCSV(file_path):
    needed_column = ['學號', '學年度', '學期', '當期課號', '開課系所', '永久課號', '學生選別', 'scr_summaryno', '學分數']
    needed_type = [np.int64, np.int64, np.int64, np.int64, object, object, object, object, np.int64]
    record_status = 1
    validate_flag = True
    df = pd.read_csv(file_path)
    csv_column = df.keys().tolist()

    all_include = set(needed_column).issubset(csv_column)
    if all_include == False:
        record_status = 0
        error_column = str(set(needed_column) - set(csv_column))
        message = "錯誤：名稱有誤 : " + error_column
        validate_flag = False
        checkFile.recordLog(calling_file, record_status, message, mycursor, connection)
        return validate_flag
    
    #pandas type : object, int64, float64, bool, datetime64, timedelta[ns], category
    # print(df.info())
    for i in range(len(needed_column)):
        if df[needed_column[i]].dtype != needed_type[i]:
            message = "錯誤：" + needed_column[i] + "格式有誤 : " + str(df[needed_column[i]].dtype)
            record_status = 0
            validate_flag = False
            checkFile.recordLog(calling_file, record_status, message, mycursor, connection)
            return validate_flag              
    return validate_flag

def deleteLastCourse(mycursor, connection):
    record_status = None
    code = None
    message = None
    affect_count = None
    sql_delete = """DELETE FROM on_cos_data;
                 """
    try:
        affect_count = mycursor.execute(sql_delete)
        # print("Affect count : {}".format(affect_count))
        connection.commit()
        record_status = 1
    except pymysql.InternalError as error:
        code, message = error.args
        record_status = 0
    return record_status, code, message, affect_count

def insertDB(file_path, mycursor, connection):
    record_status = None
    code = None
    message = None
    affect_count = None

    dump_sql1 = '''
        create temporary table temp_on_cos_data(
            student_id varchar(20),
            year int(11),
            semester int(11),
            code varchar(10),
            cos_dep varchar(20),
            cos_code varchar(20),
            cos_type varchar(20),
            scr_summaryno varchar(10),
            cos_credit float,
            primary key(student_id, year, semester, code)
        )DEFAULT CHARSET=utf8mb4;
    '''
    dump_sql2 = '''
        load data local infile '{}'
        into table temp_on_cos_data
        character set 'utf8'
        fields terminated by ','
        enclosed by '"'
        lines terminated by '\n'
        ignore 1 lines;
    '''
    dump_sql3 = '''
        insert into on_cos_data
        select * from temp_on_cos_data
        on duplicate key update
        cos_dep = values(cos_dep), 
        cos_code = values(cos_code),
        cos_type = values(cos_type),
        scr_summaryno = values(scr_summaryno),
        cos_credit = values(cos_credit)
        ;
    '''
    dump_sql4 = '''
        drop temporary table temp_on_cos_data;
    '''

    # try:
    #     affect_count = mycursor.execute(sql.format(file_path))
    #     connection.commit()
    #     record_status = 1
    # except pymysql.InternalError as error:
    #     code, message = error.args
    #     record_status = 0
    #     # Rollback in case there is any error
    #     # connection.rollback()

    try:
        mycursor.execute(dump_sql1)
        mycursor.execute(dump_sql2.format(file_path))
        affect_count = mycursor.execute(dump_sql3)
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

if __name__ == '__main__':
    file_path = "./original/new_on_cos_data.csv"
    global calling_file
    calling_file = __file__
    # logger = checkFile.createlogger()
    mycursor, connection = connect.connect2db()

    #Check csv file
    validate_flag = validateCSV(file_path)
    # print(validate_flag)

    if validate_flag == True:
        #Delete last semester's on cos data
        record_status, code, message, affect_count = deleteLastCourse(mycursor, connection)
        if record_status == 0:
            message = "刪除上學期課程錯誤：" + message
            checkFile.recordLog(calling_file, record_status, message, mycursor, connection)
        elif record_status == 1:
            #Import this semester's on cos data
            record_status, code, message, affect_count = insertDB(file_path, mycursor, connection)
            if record_status == 0:
                message = "匯入當期課程錯誤：" + message
                checkFile.recordLog(calling_file, record_status, message, mycursor, connection)
        if record_status == 1:
            message = "已匯入本學期當期課程共 " + str(affect_count) + ' 筆'
            checkFile.recordLog(calling_file, record_status, message, mycursor, connection)
    mycursor.close()  ## here all loops done
    connection.close()  ## close db connection