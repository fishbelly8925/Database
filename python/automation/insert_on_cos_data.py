import sys
import pymysql
import csv
import pandas as pd
import numpy as np
import checkFile
import connect

def validateCSV(file_path, unique_id, mycursor, connection):
    needed_column = ['學號', '學年度', '學期', '當期課號', '開課單位', '永久課號', '選別', 'scr_summaryno', '學分數']
    record_status = 1
    validate_flag = True
    df = pd.read_csv(file_path, dtype={'學號': object, '當期課號': object})
    csv_column = df.keys().tolist()

    all_include = set(needed_column).issubset(csv_column)
    if all_include == False:
        record_status = 0
        error_column = str(set(needed_column) - set(csv_column))
        message = "錯誤：名稱有誤 : " + error_column
        validate_flag = False
        checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        return validate_flag

    #check cos_id length == 4
    cos_len = 4
    df['cos_id_len'] = df['當期課號'].str.len()
    cos_id_check = list(df['cos_id_len']!=cos_len)
    if True in cos_id_check:
        record_status = 0
        error_cos_id_count = len(df[df['cos_id_len']!=cos_len]['當期課號'].values)
        message = "錯誤：當期課號長度有誤 (可能為開頭缺少0) 共 : " + str(error_cos_id_count) + "筆"
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

def preValidateCSV(file_path, unique_id, mycursor, connection):
    #since score has NaN, so its type will be float64
    needed_column = ['學號', '班別', '姓名', '學期', '當期課號', '永久課號', '課名',\
                     '學分數', '開課單位', '選別', '摘要', '評分方式', '成績', '備註', 'GP']
    record_status = 1
    validate_flag = True
    df = pd.read_csv(file_path, dtype={'學號': object, '當期課號': object})
    csv_column = df.keys().tolist()

    all_include = set(needed_column).issubset(csv_column)
    if all_include == False:
        record_status = 0
        error_column = str(set(needed_column) - set(csv_column))
        message = "錯誤：名稱有誤 : " + error_column
        validate_flag = False
        checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
    return validate_flag

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


def convertData(file_path, output_path, selected_year, selected_semester):
    df = pd.read_csv(file_path, dtype={'學號': object, '當期課號': object})
    concat_year_semester = str(selected_year) + str(selected_semester)
    df = df[df['學期'] == int(concat_year_semester)].reset_index(drop=True)
    df_parse = df.copy()
    df_parse = df_parse.drop(columns=['班別', '姓名', '摘要', '備註'])
    # Processing to fit table columns
    year = []
    semester = []
    year = [selected_year] * len(df)
    semester = [selected_semester] * len(df)
    scr_summaryno = [None] * len(df)

    df_parse['學年度'] = year
    df_parse['學期'] = semester
    df_parse['scr_summaryno'] = scr_summaryno
    # # Swap columns
    columns_order = ['學號', '學年度', '學期', '當期課號', '開課單位', '永久課號', '選別', 'scr_summaryno', '學分數']
    cols = list(df.columns)
    df_parse = df_parse[columns_order]
    df_parse.to_csv(output_path, index = False, encoding = 'utf-8')


if __name__ == '__main__':
    """./original/108-2-new_on_cos_data.csv"""
    file_path = sys.argv[1]
    csv_path = '.'.join(file_path.split('.')[:-1]) + '_parsed_on_cos_data.csv'
    year = file_path.split('/')[-1].split('-')[0]
    semester = file_path.split('/')[-1].split('-')[1]
    global calling_file
    calling_file = __file__
    mycursor, connection = connect.connect2db()

    #Insert pending status (2) into database
    record_status = 2
    unique_id = checkFile.initialLog(calling_file, record_status, year, semester, mycursor, connection)

    # Pre Check csv file
    validate_flag = preValidateCSV(file_path, unique_id, mycursor, connection)

    if validate_flag:
        # Parse csv to fit format
        convertData(file_path, csv_path, year, semester)

        #Check csv file
        validate_flag = validateCSV(csv_path, unique_id, mycursor, connection)

    if validate_flag == True:
        #Delete last semester's on cos data
        record_status, code, message, affect_count = deleteLastCourse(mycursor, connection)
        if record_status == 0:
            message = "刪除上學期課程錯誤：" + message
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        elif record_status == 1:
            #Import this semester's on cos data
            record_status, code, message, affect_count = insertDB(csv_path, mycursor, connection)
            if record_status == 0:
                message = "匯入當期課程錯誤：" + message
                checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
        if record_status == 1:
            message = "已匯入本學期當期課程共 " + str(affect_count) + ' 筆'
            checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
    mycursor.close()  ## here all loops done
    connection.close()  ## close db connection