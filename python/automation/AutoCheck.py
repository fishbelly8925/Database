from os import listdir
from os.path import isfile, isdir, join
import os
import logging
import shutil
import time

import CosScore
import OnCos
	

# path = "/home/nctuca/db_data/Score
# path = "/home/nctuca/db_data/Offset
# path = "/home/nctuca/db_data/OnCos

# Logger
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger()
# formatter = logging.Formatter(
# 	'%(asctime)s - %(name)s - %(levelname)s: - %(message)s' ,
# 	datefmt= '%Y-%m-%d %H:%M:%S'
# )
# fh = logging.FileHandler('auto_log.txt')
# fh.setFormatter(formatter)
# logger.addHandler(fh)


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
		else:
			print('No any file exists')


