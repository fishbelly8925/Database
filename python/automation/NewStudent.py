import pymysql
import csv
import logging

def CreateLog():
	# Logger
	logging.basicConfig(level=logging.INFO)
	formatter = logging.Formatter(
		'%(asctime)s - %(name)s - %(levelname)s: - %(message)s' ,
		datefmt= '%Y-%m-%d %H:%M:%S'
	)
	fh = logging.FileHandler('./NewStudent/log.txt')
	fh.setFormatter(formatter)
	logger = logging.getLogger()
	logger.addHandler(fh)
	return logger

def FormatFloat(str):
	if str == 'NULL':
		return None
	else:
		str = float(str)
		return str

def FormatInt(str):
	if str == 'NULL':
		return None
	else:
		str = int(str)
		return str

def CheckFormat(file_name):
	fileName = file_name
	csvFile = open(fileName, 'r', encoding="utf8")
	csvCursor = csv.reader(csvFile)
	err_flag = 0
	row_count = 0

	for row in csvCursor:
		row_count = row_count + 1
		# check row length
		if len(row) != 9:
			# error log
			logger = CreateLog()
			logger.error('csv format error: line {}: 長度不等於8'.format(row_count))
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
			elif len(row[2]) != 5 or row[2][3] not in ['一', '二', '三', '四',] or row[2][4] not in ['A', 'B', 'C', 'D']:
				# error log
				logger = CreateLog()
				logger.error('csv format error: line {}: 第三欄「班級」格式錯誤'.format(row_count))
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
		select * from student where student_id = %s
	"""
	sql_insert="""
		insert into student
		(student_id, sname, program, grade, gender, enroll_status, 
		now_status, study_status, email, ename)
		values
		(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
	"""
	sql_update="""
		update student
		set sname = %s, 
		program = %s, 
		grade = %s, 
		gender = %s, 
		enroll_status = %s, 
		now_status = %s, 
		study_status = %s, 
		email = %s,
		ename = %s
		where student_id = %s
	"""
	csvFile = open(fileName, 'r', encoding="utf8")
	csvCursor = csv.reader(csvFile)
	list_insert_params = []
	list_update_params = []
	row_count = 0

	for row in csvCursor:
		row_count = row_count + 1
		if row_count == 1:
			continue
		student_id = row[0]
		sname = row[1]
		program = row[2][4]
		grade = row[2][3]
		gender = row[3]
		enroll_status = row[4]
		now_status = row[5]
		study_status = row[6]
		email = row[7]
		ename = row[8]
		
		cursor = conn.cursor()
		cursor.execute(sql_select, student_id)
		if cursor.fetchone() != None:
			sql_data = (sname, program, grade, gender, enroll_status, now_status, study_status, email, ename, student_id)
			list_update_params.append(sql_data)
		else:
			sql_data = (student_id, sname, program, grade, gender, enroll_status, now_status, study_status, email, ename)
			list_insert_params.append(sql_data)
	
	affected_rows = 0
	try:
		cursor = conn.cursor()
		cursor.executemany(sql_insert, list_insert_params)
		affected_rows = affected_rows + cursor.rowcount
		cursor.executemany(sql_update, list_update_params)		
		affected_rows = affected_rows + cursor.rowcount
		conn.commit()
	except Exception as e:
		# error log
		conn.rollback()
		logger = CreateLog()
		logger.error('mysql query error: %s', e)
		err_flag = 1
	finally:
		cursor.close()

	if (len(list_insert_params) + len(list_update_params)) == affected_rows:
		# success log
		logger = CreateLog()
		logger.info('Success: insert and update {} rows to student'.format(affected_rows))

	conn.close()

	if err_flag:
		return False
	else: 
		return True
