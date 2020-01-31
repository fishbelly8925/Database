import logging
import os

#Store in log file
def create_logger():
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
def record_log(calling_file, record_status, mycursor, connection):
    sql_log = """INSERT INTO log_file (calling_file, status, message)
    VALUES (%s,%s,%s);
    """
    message = None
    if record_status == 1:
        message = "Successfully completed"
    elif record_status == 0:
        message = "Failed to complete"
    check = [calling_file, record_status, message]
    mycursor.execute(sql_log, tuple(check))
    myresult = mycursor.fetchall()

if __name__ == '__main__':
    logger = create_logger()
    logger.warning('HIHI')
    print(logger.asctime)