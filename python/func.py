import MySQLdb
import sqlString as sql
import numpy as np

conn=MySQLdb.connect(db='test',user='root',passwd='jack02',charset='utf8')

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

def findAllCos(): #find all CS cos name
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

def findAllStudent(): #find all CS student
    cursor=conn.cursor()
    cursor.execute("select student_id from student")
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        res.add(i[0])
    res=list(res)
    res.sort()
    cursor.close()
    return res

def changeScore(s):
    a=s-60
    if a<0:
        return 0
    elif a==40:
        return 4
    return int(a/10+1)

def findGrades(stds,cos):
    cursor=conn.cursor()
    res=[]
    for std in stds:
        cursor.execute(sql.findGrad,{'id':std})
        temp=cursor.fetchall()
        grad=np.full(len(cos),np.nan)
        for i in temp:
            try:
                idx=cos.index(parseEng(i[0]))
                grad[idx]=changeScore(i[1])
            except:
                continue
        res.append(grad)
    res=np.array(res)
    return res

def getSimilarity(a,b):
    if a[~np.isnan(a)].size==0 or b[~np.isnan(b)].size==0:
        return 0
    a_mean=a[~np.isnan(a)].mean()
    b_mean=b[~np.isnan(b)].mean()
    a_sub=a-a_mean
    b_sub=b-b_mean
    a_m=(a_sub**2)[~np.isnan(a_sub)].sum()**(1/2)
    b_m=(b_sub**2)[~np.isnan(b_sub)].sum()**(1/2)
    # if a_m==0 and b_m==0:
    # 	return 1
    # elif a_m==0 or b_m==0:
    # 	return 0
    if a_m==0 or b_m==0:
        return 0
    temp=a_sub*b_sub
    s=temp[~np.isnan(temp)].sum()
    return s/a_m/b_m

def predict(sim,grads):
    mean=np.nanmean(grads,axis=1,keepdims=True)
    mean=mean.reshape(len(mean))
    std_num=len(grads)
    cos_num=len(grads[0])
    pred=np.zeros((std_num,cos_num))
    for a in range(std_num):
        if np.isnan(mean[a]):
            continue
        for p in range(cos_num):
            if ~np.isnan(grads[a][p]):
                continue
            r=grads[:,p]-mean
            s=sim[a]*r
            s=s[~np.isnan(s)].sum()
            m=sim[a]+r-r
            m=m[~np.isnan(m)].sum()
            if m==0:
                continue
            pred[a][p]=mean[a]+(s/m)
    return pred

def generate(cos,pred,num):
    sorted_pred=np.sort(pred)
    res=[]
    length=len(sorted_pred)
    for i in range(length):
        temp=set()
        for j in range(1,num+1):
            if sorted_pred[i][-j]==0:
                break
            end=np.where(pred[i]==sorted_pred[i][-j])[0]
            for k in end:
                temp.add(cos[k])
        res=list(res)
        res.append(temp)
    return res