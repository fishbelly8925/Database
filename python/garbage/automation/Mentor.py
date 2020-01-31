import xlrd
import csv
import pymysql
import logging

def CreateLog():
    # Logger
    logging.basicConfig(level=logging.INFO)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s: - %(message)s' ,
        datefmt= '%Y-%m-%d %H:%M:%S'
    )
    fh = logging.FileHandler('./Mentor/log.txt')
    fh.setFormatter(formatter)
    logger = logging.getLogger()
    logger.addHandler(fh)
    return logger

def CheckFormat(file_name):
    fileName = file_name
    csvFile = open(fileName, 'r', encoding="utf8")
    csvCursor = csv.reader(csvFile)
    err_flag = 0
    row_count = 0

    for row in csvCursor:
        row_count = row_count + 1
        # check row length
        if len(row) != 4:
            # error log
            logger = CreateLog()
            logger.error('csv format error: line {}: 長度不等於4'.format(row_count))
            err_flag = 1
            break
        # check first row
        elif row_count == 1:
            if row[0] != '學號':
                # error log
                logger = CreateLog()
                logger.error('csv format error: line {}: 第一列格式錯誤'.format(row_count))
                err_flag = 1
                break
        else:
            # student_id must be 7 numbers
            if len(row[0]) != 7:
                # error log
                logger = CreateLog()
                logger.error('csv format error: line {}: 第一欄「學號」格式錯誤'.format(row_count))
                err_flag = 1
                break
            else:
                continue

    csvFile.close()

    if err_flag:
        return False
    else: 
        return True

def ImportData(file_name):
    fileName = file_name
    err_flag = 0
    conn=pymysql.connect(host='localhost', user='root', password='mickey94378', db='ca', charset='utf8mb4')
    sql_select="""
        select * from mentor_list where student_id = %s
    """
    sql_insert="""
        insert into mentor_list
        (student_id, identity, tname)
        values
        (%s, %s, %s)
    """
    sql_update="""
        update mentor_list
        set identity = %s, tname = %s
        where student_id = %s
    """
    csvFile = open(fileName, 'r', encoding="utf8")
    csvCursor = csv.reader(csvFile)
    list_insert = []
    list_update = []
    row_count = 0

    for row in csvCursor:
        row_count = row_count + 1
        if row_count == 1:
            continue
        student_id = row[0]
        identity = row[1]
        tname = row[3]

        cursor = conn.cursor()
        cursor.execute(sql_select, student_id)
        if cursor.fetchone() == None:
            # insert
            sql_data = (student_id, identity, tname)
            list_insert.append(sql_data)
        else:
            # update
            sql_data = (identity, tname, student_id)
            list_update.append(sql_data)
   
    try:
        # insert
        cursor = conn.cursor()
        cursor.executemany(sql_insert, list_insert)
        conn.commit()
        # update
        cursor.executemany(sql_update, list_update)
        conn.commit()
    except Exception as e:
        # error log
        logger = CreateLog()
        logger.error('mysql query error: %s', e)
        err_flag = 1
    finally:
        cursor.close()

    conn.close()

    if err_flag:
        return False
    else: 
        # success log
        logger = CreateLog()
        logger.info('Success: insert and update to mentor_list')
        return True

def XLStoCSV(file_name):
    err_flag = 0
    try:
        workbook = xlrd.open_workbook(file_name)
        table = workbook.sheet_by_index(0)
        csv_name = file_name.split('.')
        csv_name = csv_name[0] + '.csv'
        with open(csv_name, 'w', encoding='utf-8') as file:
            write = csv.writer(file)
            for row_num in range(table.nrows):
                row_value = table.row_values(row_num)
                if row_value[1] == '交換學生':
                    continue
                if row_value[2] == '修學':
                    print(row_value[3])
                    row_value[3] == None
                write.writerow(row_value)
    except Exception as e:
        # error log
        logger = CreateLog()
        logger.error('xls convert error: %s', e)
        err_flag = 1
    finally:
        pass

    if err_flag:
        return False
    else: 
        return True
