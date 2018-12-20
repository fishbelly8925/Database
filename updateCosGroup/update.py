import csv
import MySQLdb
import sql

def parseEng(cos):
    if '英文授課' in cos:
        cos=cos[:-6]
    elif '(英文班' in cos:
        cos=cos[:-5]
    elif '(英文' in cos or '（英文' in cos:
        cos=cos[:-4]
    elif '(英' in cos or '（英'in cos:
        cos=cos[:-3]
    else:
        cos=cos
    return cos

def parseCal(cos):
	cos = cos.replace('甲','').replace('（','(').replace('）',')')
	cos = cos.replace('〔','(').replace('〕',')').strip(' ')
	cos = cos.replace('Ａ','').replace('Ｂ','')
	return cos

def parseMentor(cos):
	if '導師時間' in cos:
		cos = '導師時間'
	return cos

def parseThreeInOne(cos):
	cos = cos.replace('（','(').replace('）',')')
	cos = cos.replace('榮譽班','')
	cos = cos.replace(' ','')
	if cos == '物理(一)' or cos == '化學(一)' or cos == '普通生物學(一)':
		cos = '物化生三選一(一)'
	elif cos == '物理(二)' or cos == '化學(二)' or cos == '普通生物學(二)':
		cos = '物化生三選一(二)'
	return cos


conn=MySQLdb.connect(db='ca',user='root',passwd='jack02',charset='utf8')

with open('cos_group.csv','r+') as file:
	rows = list(csv.reader(file))
	file.seek(0)

	cursor = conn.cursor()
	cursor.execute(sql.Find_Cos)
	result = cursor.fetchall()

	first_row = rows[0]
	file.write(str(first_row[0])+','+str(first_row[1])+','+str(first_row[2])+'\n')

	for row in rows[1:]:
		cos_code_set = set(row[2].split('"')[1::2])
		cos_cname = row[0]
		
		for idx, sql_cos in enumerate(result):
			if sql_cos[0][0:3] == '微積分':	# parse calculation
				sql_cos = tuple([parseCal(sql_cos[0]), sql_cos[1]])
			sql_cos = tuple([parseMentor(sql_cos[0]), sql_cos[1]])
			sql_cos = tuple([parseThreeInOne(sql_cos[0]), sql_cos[1]])
			if parseEng(sql_cos[0]) == cos_cname:
				cos_code_set.add(sql_cos[1])

		cos_code_str = '"["'
		for i in cos_code_set:
			cos_code_str += '"'+str(i)+'"'
			cos_code_str += '","'
		cos_code_str = cos_code_str[0:-3] + '"]"'
		file.write(str(row[0])+','+str(row[1])+','+cos_code_str+'\n')
		print(cos_cname, cos_code_str)