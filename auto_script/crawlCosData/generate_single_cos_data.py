# merge several cos_data csv to generate cos_name.csv and cos_data
# cos_name.csv will have ('unique_id','cos_code','cos_cname','cos_ename')
# cos_data.csv will have ('unique_id','brief','brief_new','cos_code','cos_credit','cos_hours','cos_id','cos_time','cos_type','cos_typeext','degree','depType','dep_id','memo','num_limit','reg_num','teacher','grade')
# cos_data is from year 103 ~ 105 (include summer cos) and 106-1 

import csv
import sys

base_dir = '/home/nctuca/dinodino-extension/db_data/crawlCosData/'

dtHeader = ['unique_id','brief','brief_new','cos_code','cos_credit','cos_hours','cos_id','cos_time','cos_type','cos_typeext','degree','depType','dep_id','memo','num_limit','reg_num','teacher','grade']
cnHeader = ['unique_id','cos_code','cos_cname','cos_ename']
filename = sys.argv[1]

cn = open(base_dir+'cos_name.csv','w')
cnWriter = csv.writer(cn)
cnWriter.writerow(cnHeader)

dt = open(base_dir+'cos_data.csv', 'w')
dtWriter = csv.writer(dt)
dtWriter.writerow(dtHeader)

cd = open(filename, 'r')
cdReader = csv.reader(cd)

next(cdReader, None)  # skip the headers

for row in cdReader:
    unique_id, cos_code = row[0].strip('"'), row[4].strip('"')
    cos_cname, cos_ename = row[3].strip('"'), row[6].strip('"')
    cnWriter.writerow([unique_id, cos_code, cos_cname, cos_ename,''])

    brief, brief_new = row[1], row[2]
    cos_credit, cos_hours = row[5], row[7] 
    cos_id, cos_time = row[8], row[9]
    cos_type, cos_typeext = row[10], row[11]
    degree, depType = row[12], row[13]
    dep_id, memo = row[14], row[15]
    num_limit, reg_num = row[16], row[17]
    teacher, grade = row[18], row[19]

    dtWriter.writerow([unique_id,brief,brief_new,cos_code,cos_credit,cos_hours,cos_id,cos_time,cos_type,cos_typeext,degree,depType,dep_id,memo,num_limit,reg_num,teacher,grade,''])

cd.close()
dt.close()
cn.close()
