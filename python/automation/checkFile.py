import logging
import os

#Store in log file
def createlogger():
    dir_path = './autolog/'
    filename = 'autocheck.log'
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    logging.basicConfig(level=logging.INFO)
    logging.captureWarnings(True)               #Capture python warnings
    logger = logging.getLogger()
    formatter = logging.Formatter(
        '%(asctime)s, %(filename)s, %(name)s, %(levelname)s, %(message)s' ,
        datefmt= '%Y-%m-%d %H:%M:%S'
    )
    fh = logging.FileHandler(dir_path + filename)
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    return logger

#Store in DB, 0 : FAIL, 1 : SUCCESS
def recordLog(calling_file, record_status, message, mycursor, connection):
    sql_log = """INSERT INTO log_file (calling_file, status, message)
    VALUES (%s,%s,%s);
    """
    check = [calling_file, record_status, message]
    mycursor.execute(sql_log, tuple(check))
    connection.commit()

if __name__ == '__main__':
    logger = createlogger()
    logger.warning('HIHI')
    print(logger.asctime)