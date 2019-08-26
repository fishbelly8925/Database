from os import listdir
from os.path import isfile, isdir, join
import os
import logging
import shutil
import time
import smtplib
from email.mime.text import MIMEText
from email.header import Header

import CosScore
import OnCos
import Mentor
import NewStudent
	
# sender = 'mickey94378@gmail.com'
# receivers = ['holy.cs05@nctu.edu.tw']

# gmail_user = 'mickey94378@gmail.com'
# gmail_password = '1234567' # your gmail password

# mail_content = """
# 助理您好：
# blablablabla

# Dinodino 交大資工系線上助理
# https://dinodino.nctu.edu.tw/

# 本信由系統發出，請勿直接回覆此信。
# """
# message = MIMEText(mail_content, 'plain', 'utf-8')
# message['From'] = Header("Dinodino 交大資工線上助理", 'utf-8')
# message['To'] =  Header("", 'utf-8')
# mail_subject = 'Dinodino 郵件測試'
# message['Subject'] = Header(mail_subject, 'utf-8')

# try:
# 	smtpObj = smtplib.SMTP_SSL('smtp.gmail.com', 465)
# 	smtpObj.ehlo()
# 	smtpObj.login(gmail_user, gmail_password)
# 	smtpObj.sendmail(sender, receivers, message.as_string())
# 	print("Successfully sent email")
# 	smtpObj.quit()
# except smtplib.SMTPException as e:
# 	print("Error: {}".format(e))

# path = "/home/nctuca/db_data/Score
# path = "/home/nctuca/db_data/Offset
# path = "/home/nctuca/db_data/OnCos

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()
formatter = logging.Formatter(
	'%(asctime)s - %(name)s - %(levelname)s: - %(message)s' ,
	datefmt= '%Y-%m-%d %H:%M:%S'
)
fh = logging.FileHandler('auto_log.txt')
fh.setFormatter(formatter)
logger.addHandler(fh)


mypath = '/Users/holy/Desktop'
base_path = '/Users/holy/Desktop'

files = listdir(mypath)

for filename in files:
	# 產生檔案的絕對路徑
	fullpath = join(mypath, filename)

	# 判斷 fullpath 是檔案還是目錄
	if isfile(fullpath):
		if filename == '107_2_score.csv':
			# Check csv format 
			if CosScore.CheckFormat(filename) == True:
				# Import score data
				if CosScore.ImportData(filename) == True:
					# Backup score data
					if os.path.exists(base_path + '/Backup/Score'):
						shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/Score/{}'.format(base_path, filename))
					else:
						os.mkdir('{}/Backup/Score'.format(base_path))
						shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/Score/{}'.format(base_path, filename))
				else:
					err_time = time.strftime("%Y%m%d", time.localtime()) 
					shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
					continue
			else:
				err_time = time.strftime("%Y%m%d", time.localtime()) 
				shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
				continue
		elif filename == '107_2_oncos.csv':
			# Check csv format 
			if OnCos.CheckFormat(filename) == True:
				# Import score data
				if OnCos.ImportData(filename) == True:
					# Backup score data
					if os.path.exists(base_path + '/Backup/OnCos'):
						shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/OnCos/{}'.format(base_path, filename))
					else:
						os.mkdir('{}/Backup/OnCos'.format(base_path))
						shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/OnCos/{}'.format(base_path, filename))
				else:
					err_time = time.strftime("%Y%m%d", time.localtime()) 
					shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
					continue
			else:
				err_time = time.strftime("%Y%m%d", time.localtime()) 
				shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
				continue
		elif filename == '107_2_mentor.xls':
			if Mentor.XLStoCSV(filename) == True:		
				# Check csv format 
				if Mentor.CheckFormat('107_2_mentor.csv') == True:
					# Import score data
					if Mentor.ImportData('107_2_mentor.csv') == True:
						# Backup score data
						if os.path.exists(base_path + '/Backup/Mentor'):
							shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/Mentor/{}'.format(base_path, filename))
						else:
							os.mkdir('{}/Backup/Mentor'.format(base_path))
							shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/Mentor/{}'.format(base_path, filename))
					else:
						err_time = time.strftime("%Y%m%d", time.localtime()) 
						shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
						continue
				else:
					err_time = time.strftime("%Y%m%d", time.localtime()) 
					shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
					continue
			else:
				err_time = time.strftime("%Y%m%d", time.localtime()) 
				shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
				continue
		if filename == '108_1_student.csv':
			# Check csv format 
			if NewStudent.CheckFormat(filename) == True:
				# Import score data
				if NewStudent.ImportData(filename) == True:
					# Backup score data
					if os.path.exists(base_path + '/Backup/NewStudent'):
						shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/NewStudent/{}'.format(base_path, filename))
					else:
						os.mkdir('{}/Backup/Score'.format(base_path))
						shutil.move('{}/{}'.format(base_path, filename), '{}/Backup/NewStudent/{}'.format(base_path, filename))
				else:
					err_time = time.strftime("%Y%m%d", time.localtime()) 
					shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
					continue
			else:
				err_time = time.strftime("%Y%m%d", time.localtime()) 
				shutil.move('{}/{}'.format(base_path, filename), '{}/{}_{}'.format(base_path, err_time, filename))
				continue
		else:
			print('No any file exists')


