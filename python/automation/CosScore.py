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
	fh = logging.FileHandler('./Score/log.txt')
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
		if len(row) != 15:
			# error log
			logger = CreateLog()
			logger.error('csv format error: line {}: 長度不等於15'.format(row_count))
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

def ImportData(file_name):
	fileName = file_name
	err_flag = 0
	conn=pymysql.connect(host='localhost', user='root', password='', db='ca', charset='utf8mb4')
	sql_insert="""
		insert into cos_score
		(student_id, cos_year, semester, cos_id, cos_dep, cos_cname, cos_code, cos_type, brief, cos_credit, score_type,
pass_fail, score, score_level, gp)
		values
		(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
		cos_year = row[1]
		semester = row[2]
		cos_id = row[3]
		cos_dep = row[4]
		cos_cname = row[5]
		cos_code = row[6]
		cos_type = row[7]
		brief = row[8]
		cos_credit = FormatFloat(row[9])
		score_type = row[10]
		pass_fail = row[11]
		score = FormatInt(row[12])
		score_level = row[13]
		gp = FormatFloat(row[14])
		
		sql_data = (student_id, cos_year, semester, cos_id, cos_dep, cos_cname, cos_code, cos_type, brief, cos_credit, score_type,
pass_fail, score, score_level, gp)
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
		logger.info('Success: insert {} rows to cos_score'.format(affected_rows))

	conn.close()

	if err_flag:
		return False
	else: 
		return True


