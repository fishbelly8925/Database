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
	fh = logging.FileHandler('./OnCos/log.txt')
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
		if len(row) != 12:
			# error log
			logger = CreateLog()
			logger.error('csv format error: line {}: 長度不等於12'.format(row_count))
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
			elif len(row[1]) != 3:
				# error log
				logger = CreateLog()
				logger.error('csv format error: line {}: 第二欄「學年度」格式錯誤'.format(row_count))
				err_flag = 1
				break
			elif row[2] not in ['1', '2', '3']:
				# error log
				logger = CreateLog()
				logger.error('csv format error: line {}: 第三欄「學期」格式錯誤'.format(row_count))
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
	sql_insert="""
		insert into on_cos_data
		(student_id, year, semester, code, cos_code, brief, brief_new, 
		cos_cname, cos_ename, cos_type, cos_typeext, cos_credit)
		values
		(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
	"""
	csvFile = open(fileName, 'r', encoding="utf8")
	csvCursor = csv.reader(csvFile)
	list_params = []
	row_count = 0

	for row in csvCursor:
		row_count = row_count + 1
		if row_count == 1:
			continue
		student_id = row[0]
		year = row[1]
		semester = row[2]
		code = row[3]
		cos_code = row[4]
		brief = row[5]
		brief_new = row[6]
		cos_cname = row[7]
		cos_ename = row[8]
		cos_type = row[9]
		cos_typeext = row[10]
		cos_credit = FormatFloat(row[11])
		
		sql_data = (student_id, year, semester, code, cos_code, brief, brief_new, cos_cname, cos_ename, cos_type, cos_typeext, cos_credit)
		list_params.append(sql_data)
	
	affected_rows = 0
	try:
		cursor = conn.cursor()
		cursor.executemany(sql_insert, list_params)
		conn.commit()
		affected_rows = cursor.rowcount
	except Exception as e:
		# error log
		logger = CreateLog()
		logger.error('mysql query error: %s', e)
		err_flag = 1
	finally:
		cursor.close()

	if len(list_params) == affected_rows:
		# success log
		logger = CreateLog()
		logger.info('Success: insert {} rows to on_cos_data'.format(affected_rows))

	conn.close()

	if err_flag:
		return False
	else: 
		return True
