import pymysql
import numpy as np
import pandas as pd
import csv
import checkFile
import connect
import sys
import os

def validateCSV(file_path, unique_id):
	needed_column = ['學號', '申請年度', '申請學期', '原修課學年度', '原修課學期', '原修課當期課號', '原修課課名', 
					'欲抵免免修永久課號', '欲抵免免修課名', '學分數', '抵免或免修', '原課程向度', '學生選別', '欲抵免免修課程向度']
	record_status = 1
	validate_flag = True
	df = pd.read_csv(file_path, encoding = 'utf-8')
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
	

def convert_coscode(file_path, mycursor, connection):

	df = pd.read_csv(file_path, encoding = 'utf-8', dtype = {'學號':object, '原修課學年度':object, '原修課學期':object, '原修課當期課號':object})

	# insert "原修課永久課號"
	col_name=df.columns.tolist()
	col_name.insert(5, "原修課永久課號")
	df = df.reindex(columns = col_name)

	year = df['原修課學年度'].tolist()
	semester = df['原修課學期'].tolist()
	code = df['原修課當期課號'].tolist()
	offset_type = df['抵免或免修'].tolist()
	cos_code_old = df['原修課永久課號'].tolist()

	for i in range(len(year)):
		if(offset_type[i] == '抵免'):
			continue
		elif(offset_type[i] == '免修'):
			item = str(year[i]) + '-' + str(semester[i]) + '-' + str(code[i])
			mycursor.execute("select cos_code from cos_name where unique_id = '%s';" %item)
			tmp = mycursor.fetchall()
			if tmp != ():
				cos_code_old[i] = tmp[0][0]
			else:
				msg = item + " 沒有找到原修課永久課號"
				print(msg)
	df['原修課永久課號'] = cos_code_old

	col = ['學號', '申請年度', '申請學期', '原修課永久課號', '原修課課名', 
		   '欲抵免免修永久課號', '欲抵免免修課名', '學分數', '抵免或免修', '原課程向度', '學生選別', '欲抵免免修課程向度']
	df = df[col]

	output_path = os.getcwd() + "/temp_offset.csv"
	df.to_csv(output_path, index = False, encoding = 'utf-8')
	return output_path
	

def insert2db(file_path, mycursor, connection):
	record_status = None
	code = None
	message = None
	affect_count = None

	sql1 =  """create table temp_offset(
				student_id varchar(10),
				apply_year varchar(10),
				apply_semester varchar(10),
				cos_code_old varchar(10),
				cos_cname_old varchar(50),
				cos_code varchar(10),
				cos_cname varchar(50),
				credit int(11),
				offset_type varchar(20),
				brief varchar(50),
				cos_type varchar(50),
				brief_new varchar(50)
			)DEFAULT CHARSET=utf8mb4;
			"""

	sql2 =  """load data local infile '{}'
			into table temp_offset
			character set 'utf8mb4'
			fields terminated by ','
			enclosed by '"'
			lines terminated by '\n'
			ignore 1 lines;
			"""
	
	sql3 =  """insert into offset
				select * from temp_offset as ost
				on duplicate key update
				student_id = ost.student_id,
				apply_year = ost.apply_year,
				apply_semester = ost.apply_semester,
				cos_code_old = ost.cos_code_old,
				cos_cname_old = ost.cos_cname_old,
				cos_code = ost.cos_code,
				cos_cname = ost.cos_cname,
				credit = ost.credit,
				offset_type = ost.offset_type,
				brief = ost.brief,
				cos_type = ost.cos_type,
				brief_new = ost.brief_new
				;
			"""

	sql4 =  """drop table temp_offset;
			"""

	try:
		mycursor.execute(sql1)
		mycursor.execute(sql2.format(file_path))
		mycursor.execute(sql3)
		affect_count = mycursor.rowcount
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
	"""./original/108-2-new_offset_data.csv"""
	file_path = sys.argv[1]
	year = file_path.split('/')[-1].split('-')[0]
	semester = file_path.split('/')[-1].split('-')[1]
	global calling_file
	calling_file = __file__
	mycursor, connection = connect.connect2db()

	# Insert pending status (2) into database
	record_status = 2
	unique_id = checkFile.initialLog(calling_file, record_status, year, semester, mycursor, connection)

	# Check csv file
	validate_flag = validateCSV(file_path, unique_id)

	output_path = convert_coscode(file_path, mycursor, connection)
	
	if validate_flag == True:
		record_status, code, message, affect_count = insert2db(output_path, mycursor, connection)
		if record_status == 0:
			message = "匯入抵免免修資料錯誤：" + message
			checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
		if record_status == 1:
			message = "已匯入抵免免修資料共" + str(affect_count) + "筆"
			checkFile.recordLog(unique_id, record_status, message, mycursor, connection)
	mycursor.close()
	connection.close()
	try:
		os.remove(output_path)
	except OSError as e:
		print(e)