import pymysql
import sqlString as sql
import numpy as np
import re

def connect2db():
    connection = pymysql.connect(
                host='localhost', db='ca',
                user='root', passwd='jack02', local_infile=True)
    mycursor = connection.cursor()
    return mycursor, connection

cursor, _ = connect2db()

def parseEng(cos):
    cos = cos.strip()
    cos = cos.strip(')')
    cos = cos.strip('）')
    cos = cos.replace('英文授課', '')
    cos = cos.replace(': ', ' ')
    cos = cos.replace(':', ' ')
    cos = cos.replace('-', ' ')
    cos = cos.replace('/', '')
    cos = cos.replace(', ', ' ')
    cos = cos.replace(',', ' ')
    cos = cos.replace('&', 'and')
    cos = cos.replace(' (', ' ')
    cos = cos.replace('(', ' ')
    cos = cos.replace('（', ' ')
    cos = cos.replace(' （', ' ')
    cos = cos.replace('lab.', 'lab')
    cos = cos.replace(' 1', ' i')
    cos = cos.replace(' 2', ' ii')
    cos = cos.replace('英文班', '')
    cos = cos.replace('英文', '')
    cos = cos.replace('英', '')

    cos = cos.split(' ')
    while '' in cos:
        cos.remove('')
    cos = ''.join(cos)
    cos = cos.strip(')')
    cos = cos.strip('）')
    return cos

def findAllCos():
    cursor.execute(sql.findAllCos)
    temp = cursor.fetchall()
    res = set()
    for i in temp:
        i = i[0]
        i = parseEng(i)
        res.add(i)
    res = list(res)
    res.sort()
    return res


def findCurCos(year_sem):
    cursor.execute(sql.findCurCos.format(prefix=f"{year_sem['year']}-{year_sem['semester']}"))
    temp = cursor.fetchall()
    res = set()
    for i in temp:
        i = i[0]
        i = parseEng(i)
        res.add(i)
    res = list(res)
    res.sort()
    return res

def Student_fromScore():
    cursor.execute("select distinct student_id from cos_score\
        where student_id like '0716%' \
            or student_id like '0616%' \
            or student_id like '0516%' \
            or student_id like '0416%' \
            or student_id like '0316%'")
    temp = cursor.fetchall()
    res=set()
    for i in temp:
        ## Filter student who are not undergraduate student
        i = i[0]
        if i[0] != '0' or i[2] != '1':
            continue
        res.add(i)
    res = list(res)
    res.sort()
    return res

def Student_fromTable():
    cursor.execute("select distinct student_id from student;")
    temp = cursor.fetchall()
    res=set()
    for i in temp:
        ## Filter student who are not undergraduate student
        i = i[0]
        if i[0] != '0' or i[2] != '1':
            continue
        res.add(i)
    res = list(res)
    res.sort()
    return res

def normByCos(s, avg_std):
    new_s = (s-avg_std['avg'])/avg_std['std']
    return new_s

def normByStudent(s, score):
    new_s = (s-score.mean())/score.std()
    return new_s

def findGradsAvgStd():
    cursor.execute(sql.findGradAvgStd)
    temp = cursor.fetchall()
    res = dict()
    for data in temp:
        res[data[0]] = {
            'avg': data[1], 
            'std': data[2]
        }
    return res

def findGrads(stds, cos, skip_year_sem=None):
    res = []
    avg_std_map = findGradsAvgStd()
    for std in stds:
        score_list = []

        ### Specific Semester Score
        if skip_year_sem:
            cursor.execute(sql.findGrad_with_skip.format(id=std,\
                year=skip_year_sem['year'], semester=skip_year_sem['semester']))
        else:
            cursor.execute(sql.findGrad.format(id=std))
        temp = cursor.fetchall()
        if len(temp) == 0:
            continue

        grad = np.full(len(cos), np.nan)
        normed_grad = np.full(len(cos), np.nan)
        for data in temp:
            idx = cos.index(parseEng(data[1]))
            if data[2] == None or avg_std_map[data[0]]['std'] == 0:
                continue
            normed_grad[idx] = normByCos(data[2], avg_std_map[data[0]])
            score_list.append(normed_grad[idx])
            grad[idx] = 1
        
        ###################################
        ### Student Intra Normalization
        score_list = np.array(score_list)
        if score_list.std() == 0 or np.isnan(score_list.std()):
            continue
        normed_grad = normByStudent(normed_grad, score_list)
        ###################################
        res.append({
            'std_id': std,
            # 'data': np.nan_to_num(grad),
            'data': np.nan_to_num(normed_grad)
        })

    return res

def findGradsSpecify(stds, cos2num, test_list):
    res = dict()
    avg_std_map = findGradsAvgStd()
    for std in stds:
        score_list = []

        ### Specific Semester Score
        cursor.execute(sql.findGradSpecify.format(id=std, year=test_list['year'],\
             semester=test_list['semester']))
        temp = cursor.fetchall()
        if len(temp) == 0:
            continue

        test_grad = np.full(len(cos2num), np.nan)
        grad = np.full(len(cos2num), np.nan)
        for data in temp:
            if parseEng(data[1]) == '進階聽力':
                continue
            idx = cos2num[parseEng(data[1])]
            if data[2] == None or avg_std_map[data[0]]['std'] == 0:
                continue
            test_grad[idx] = normByCos(data[2], avg_std_map[data[0]])
            grad[idx] = 1
        ################
        ### Remaining Semester Score
        cursor.execute(sql.findGrad.format(id=std))
        temp = cursor.fetchall()
        if len(temp) == 0:
            continue
        for data in temp:
            if parseEng(data[1]) == '進階聽力':
                continue
            idx = cos2num[parseEng(data[1])]
            if data[2] == None or avg_std_map[data[0]]['std'] == 0:
                continue
            score_list.append(normByCos(data[2], avg_std_map[data[0]]))
            
        ###################################
        ### Student Intra Normalization
        score_list = np.array(score_list)
        if score_list.std() == 0 or np.isnan(score_list.std()):
            continue
        test_grad = normByStudent(test_grad, score_list)
        ###################################
        res[std] = np.nan_to_num(test_grad)

    return res