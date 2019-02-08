import MySQLdb
import sqlString as sql
import numpy as np
from sklearn.cluster import KMeans

conn=MySQLdb.connect(db='ca',user='root',passwd='jack02',charset='utf8')

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

def findCurrentCos(sem):
    cursor=conn.cursor()
    cursor.execute(sql.findCurrentCos,{'sem':sem})
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        i=i[0]
        res.add(parseEng(i))
    res=list(res)
    res.sort()
    cursor.close()
    return res

def findAllCos():
    cursor=conn.cursor()
    cursor.execute(sql.findAllCos)
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        i=i[0]
        res.add(parseEng(i))
    res=list(res)
    res.sort()
    cursor.close()
    return res

def findAllStudent():
    cursor=conn.cursor()
    cursor.execute("select distinct student_id from student")
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        res.add(i[0])

    cursor.execute("select distinct student_id from cos_score")
    temp=cursor.fetchall()
    for i in temp:
        res.add(i[0])

    res=list(res)
    res.sort()
    cursor.close()
    return res

def findAllStudent_byGrades():
    cursor=conn.cursor()
    cursor.execute("select distinct student_id,  from cos_score")
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        res.add(i[0])
    res=list(res)
    res.sort()
    cursor.close()
    return res

def findIdCos():
    cursor=conn.cursor()
    cursor.execute(sql.findIdCos)
    temp=cursor.fetchall()

    res = dict()
    for std_id, cos in temp:
        now = res.get(std_id, list())
        now.append(parseEng(cos))
        res[std_id]=now

    return res