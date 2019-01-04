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

def findAllProCos():
    cursor=conn.cursor()
    cursor.execute(sql.findAllProCos)
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
    cursor.execute("select student_id from student")
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        res.add(i[0])
    res=list(res)
    res.sort()
    cursor.close()
    return res

def findAllStudent_byGrades():
    cursor=conn.cursor()
    cursor.execute("select distinct student_id from cos_score")
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        res.add(i[0])
    res=list(res)
    res.sort()
    cursor.close()
    return res

def changeScore(s):
    return s
    # a=s-60
    # if a<0:
    #     return 0
    # elif a==40:
    #     return 4
    # return int(a/10+1)

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
    for std_idx in range(std_num):
        if np.isnan(mean[std_idx]):
            continue
        for cos_idx in range(cos_num):
            # if ~np.isnan(grads[std_idx][cos_idx]):
            #     continue
            if grads[std_idx][cos_idx]!=0:
                continue
            r=grads[:,cos_idx]-mean
            s=sim[std_idx]*r
            s=s[~np.isnan(s)].sum()
            m=sim[std_idx]+r-r # +r-r is for some reason I forget QQ
            m=m[~np.isnan(m)].sum()
            if m==0:
                continue # pred is default zero, so we don't need to do anything
            pred[std_idx][cos_idx]=mean[std_idx]+(s/m)
    return pred

def generate(cos,pred,num):
    sorted_pred=[]
    for i in pred:
        sorted_pred.append(np.sort(i)[::-1])
    res=[]
    length=len(sorted_pred)
    for i in range(length):
        temp=[]
        dup=0
        for j in range(num):
            if dup>0: # skip this time since the previous duplicate coses which have same predict value
                dup-=1
                continue
            # if sorted_pred[i][j]==0:  # if the predict value is zero, then we stop since it doesn't worth to be recommended
            #     break
            end=np.where(pred[i]==sorted_pred[i][j])[0]
            dup=len(end)-1
            for k in end: # if more than one coses have same predict value, we use loop to add them and set variable dup
                temp.append(cos[k])
        res.append(temp)
    return res

def fillEmpty(suggest,pred):
    clu=KMeans(n_clusters=4).fit(np.nan_to_num(pred))
    nums=set(clu.labels_)
    for i in range(len(nums)):
        temp=0
        for idx,j in enumerate(clu.labels_):
            if j == i:
                if len(suggest[temp]) == 0:
                    print('Error')
                if len(suggest[idx]) == 0:
                    suggest[idx]=suggest[temp]
                temp=idx

def parseCurrentCos(stds, suggest, sem, K):
    current_cos = findCurrentCos(sem)
    result = []
    for i in range(len(suggest)):
        temp = list(filter(lambda x: x in current_cos,suggest[i]))
        if len(temp)>K:
            temp = temp[0:K]
        temp.insert(0, stds[i])
        result.append(temp)
    return result

def findCurrentCos_withMode(sem, mode):
    cursor=conn.cursor()
    if mode=='a':
        cursor.execute(sql.findCurrentBasicCos,{'sem':sem})
    elif mode=='b':
        cursor.execute(sql.findCurrentAdvanceCos,{'sem':sem})
    temp=cursor.fetchall()
    res=set()
    for i in temp:
        i=i[0]
        res.add(parseEng(i))
    res=list(res)
    res.sort()
    cursor.close()
    return res

def parseCurrentCos_withMode(stds, suggest, sem, K, mode):
    current_cos = findCurrentCos_withMode(sem, mode)
    result = []
    for i in range(len(suggest)):
        temp = list(filter(lambda x: x in current_cos,suggest[i]))
        if len(temp)>K:
            temp = temp[0:K]
        temp.insert(0, stds[i])
        result.append(temp)
    return result