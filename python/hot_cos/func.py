import sqlString as sql
import pymysql
import numpy as np
import csv

def has_key(dictionary, key):
	if(key in dictionary):
		return 1
	return 0

conn=pymysql.connect(db='ca', user='root', passwd='mickey94378', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)

def CountHistoryCos(grade):
	isFour=0
	if grade=="四":
		target_grade="四"
		isFour=1
	elif grade=='三':
		target_grade="四"
	elif grade=='二':
		target_grade="三"
	elif grade=='一':
		target_grade="二"

	cursor=conn.cursor()
	cursor.execute(sql.FindAllCos)
	result=cursor.fetchall()

	grade_dict={}
	for i in range(len(result)):
		if not isFour and result[i]['grade']==target_grade and result[i]['unique_id'][:5]=='106-2':
			key=result[i]['unique_id']
			if has_key(grade_dict, key)==1:
				grade_dict[key]['count']=grade_dict[key]['count']+1
			else:
				grade_dict[key]=result[i]
				grade_dict[key]['count']=1
		else:
			# 大四
			if result[i]['study_status']=="畢業" and result[i]['grade']==target_grade and result[i]['unique_id'][:5]=='106-2':
				key=result[i]['unique_id']
				if has_key(grade_dict, key)==1:
					grade_dict[key]['count']=grade_dict[key]['count']+1
				else:
					grade_dict[key]=result[i]
					grade_dict[key]['count']=1
	return grade_dict

# Compare course on current semester
def CompareCurrentCos(dict_old):
	cursor=conn.cursor()
	cursor.execute(sql.FindCurrentCos)
	currentCos=cursor.fetchall()

	hot_cos={}
	for key, value in dict_old.items():
		unique_id=key
		old_cname=value['cos_cname']
		old_tname=value['tname']
		old_count=value['count']
		
		if(old_count>0):
			for i in range(len(currentCos)):
				if currentCos[i]['cos_cname']==old_cname and currentCos[i]['tname']==old_tname:
					hot_cos[old_cname]={}
					url="https://timetable.nctu.edu.tw/?r=main/crsoutline&Acy=107&Sem=2&CrsNo={}&lang=zh-tw".format(currentCos[i]['cos_id'])
					hot_cos[old_cname]['unique_id']=unique_id
					hot_cos[old_cname]['count']=old_count
					hot_cos[old_cname]['url']=url
	return hot_cos

def InsertCos(grade, grade_dict):
	cursor=conn.cursor()
	cursor.execute(sql.DeleteRecord, {'grade': grade})
	for key, value in grade_dict.items():
		data={}
		data['grade']=grade
		data['unique_id']=value['unique_id']
		data['count']=int(value['count'])
		data['url']=value['url']
		cursor.execute(sql.InsertCos, data)
		conn.commit()

list_grade=['一', '二', '三', '四']
dict_temp={}

for grade in list_grade:
	print("Now calculate 大{}...".format(grade))
	dict_temp=CountHistoryCos(grade)
	dict_temp=CompareCurrentCos(dict_temp)
	print("Insert to db...")
	InsertCos(grade, dict_temp)

print("Success!")



