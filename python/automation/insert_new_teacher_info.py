import pymysql
import csv
import pandas as pd
import numpy as np
import connect
import checkFile
import sys

def validatecsv(file_path, unique_id):
    needed_column = ['電話', '教授姓名', 'email', '研究領域', '簡介', '教授id']
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

    sql1 =  """create temporary table temp_teacher_info(
                phone varchar(30),
                tname varchar(50),
                email varchar(50),
                expertise varchar(100),
                info text,
                teacher_id varchar(10),
                primary key(tname)
            )DEFAULT CHARSET=utf8mb4;
            """

    sql2 =  """load data local infile '{}'
            into table temp_teacher_info
            character set 'utf8'
            fields terminated by ','
            enclosed by '"'
            lines terminated by '\n'
            ignore 1 lines;
            """
    
    sql3 =  """insert into teacher_info
                select * from temp_teacher_info as tt
                on duplicate key update
                phone = tt.phone,
                tname = tt.tname,
                email = tt.email,
                expertise = tt.expertise,
                info = tt.info,
                teacher_id = tt.teacher_id
                ;
            """

    sql4 =  """drop temporary table temp_teacher_info;
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
            message = "匯入新老師資料錯誤：" + message
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        if record_status == 1:
            message = "已匯入新老師資料共" + str(affect_count) + "筆"
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
    mycursor.close()
    connection.close()
