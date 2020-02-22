import pymysql
import csv
import pandas as pd
import numpy as np
import connect
import checkFile

def validatecsv(file_path):
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
        checkFile.recordlog(calling_file, record_status, message, mycursor, connection)
        return validate_flag
    return validate_flag

def insert2db(file_path, mycursor, connection):
    record_status = None
    code = None
    message = None
    sql = """load data local infile '{}'
            into table teacher_info
            character set 'utf8'
            fields terminated by ','
            enclosed by '"'
            lines terminated by '\n'
            ignore 1 lines;"""
    try:
        affect_count = mycursor.execute(sql.format(file_path))
        connection.commit()
        record_status = 1
    except pymysql.InternalError as error:
        code, message = error.args
        record_status = 0
    return record_status, code, message, affect_count

if __name__ == '__main__':
    file_path = "/mnt/c/Users/happy/Downloads/CSCA/new_teacher_data.csv"    #file_path need to be modified
    global calling_file
    calling_file = __file__
    mycursor, connection = connect.connect2db()

    validate_flag = validatecsv(file_path)

    if validate_flag == True:
        record_status, code, message, affect_count = insert2db(file_path, mycursor, connection)
        if record_status == 0:
            message = "匯入新老師資料錯誤：" + message
            checkFile.recordlog(calling_file, record_status, message, mycursor, connection)
        if record_status == 1:
            message = "已匯入新老師資料共" + str(affect_count) + "筆"
            checkFile.recordlog(calling_file, record_status, message, mycursor, connection)
    mycursor.close()
    connection.close()
