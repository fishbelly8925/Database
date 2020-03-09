import pymysql
import csv
import pandas as pd
import numpy as np
import connect
import checkFile
import sys

def validatecsv(file_path, unique_id):
    needed_column = ['學號', '身分', '考試年度', '考試年級', '英檢狀態代碼']
    record_status = 1
    validate_flag = True
    df = pd.read_csv(file_path)
    csv_column = df.keys().tolist()

    all_include = set(needed_column).issubset(csv_column)
    if all_include == False:
        record_status = 0
        err_col = str(set(needed_column) - set(csv_column))
        message = "錯誤：名稱有誤：" + err_col
        validate_flag = False
        checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        return validate_flag
    return validate_flag

def insert2db(file_path, mycursor, connection):
    record_status = None
    code = None
    message = None
    affect_count = None

    sql1 =  """create temporary table temp_en_certificate(
                student_id varchar(10),
                identity varchar(20),
                test_year int(11),
                test_grade int(11),
                pass_code int(11),
                primary key(student_id)
            )DEFAULT CHARSET=utf8mb4;
            """

    sql2 =  """load data local infile '{}'
            into table temp_en_certificate
            character set 'utf8mb4'
            fields terminated by ','
            enclosed by '"'
            lines terminated by '\n'
            ignore 1 lines;
            """
    
    sql3 =  """insert into en_certificate
                select * from temp_en_certificate as ec
                on duplicate key update
                student_id = ec.student_id,
                identity = ec.identity,
                test_year = ec.test_year,
                test_grade = ec.test_grade,
                pass_code = ec.pass_code
                ;
            """

    sql4 =  """drop temporary table temp_en_certificate;
            """

    try:
        mycursor.execute(sql1)
        mycursor.execute(sql2.format(file_path))
        affect_count = mycursor.execute(sql3)
        mycursor.execute(sql4)
    except pymysql.InternalError as error:
        code, message = error.args
        record_status = 0
        connection.rollback()
    else:
        print("Success")
        connection.commit()
        record_status = 1
    return record_status, code, message, affect_count

if __name__ == '__main__':
    file_path = sys.argv[1]
    global calling_file
    calling_file = __file__
    mycursor, connection = connect.connect2db()

    # Insert pending status (2) into database
    record_status = 2
    unique_id = checkFile.initialLog(calling_file, record_status, mycursor, connection)

    # Check csv file
    validate_flag = validatecsv(file_path, unique_id)

    if validate_flag == True:
        record_status, code, message, affect_count = insert2db(file_path, mycursor, connection)
        if record_status == 0:
            message = "匯入英檢通過資料錯誤：" + message
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        if record_status == 1:
            message = "已匯入英檢通過資料共" + str(affect_count) + "筆"
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
    mycursor.close()
    connection.close()
