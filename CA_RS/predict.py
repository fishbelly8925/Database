import func
import pickle
import numpy as np
import json
import matplotlib.pyplot as plt
import csv

Top_K = 15
Type = 'eval' ### test, eval
cur_setting = {
    'year': 108,
    'semester': 2
}   

with open('./num_to_cos.json', 'r') as f1,\
    open('./cos_to_num.json', 'r') as f2, \
    open('./hot_cos.json', 'r') as f3,\
    open('./std_cos_record.json', 'r') as f4:
    num2cos = json.load(f1)
    cos2num = json.load(f2)
    hot_cos = json.load(f3)
    enrolled_record = json.load(f4)

all_student = func.Student_fromTable()
cur_cos = func.findCurCos(cur_setting)
if Type == 'test':
    cur_enrolled = func.findGradsSpecify(all_student, cos2num, cur_setting)

for method in ['KMean', 'Spectral']:
    res = []
    print(f'{method} Start')
    TP, FP, FN, empt_cnt = 0, 0, 0, 0
    with open(f'res/{method}.json', 'r') as f:
        data = json.load(f)
    for std in all_student:
        res.append([std])
        # Append The Cos in that group
        if std in data:
            if Type == 'test' and std in cur_enrolled:
                cur_tot = len(cur_enrolled[std][cur_enrolled[std]>0])

            remain_cnt = Top_K
            for item in data[std]:
                if num2cos[item[0]] not in cur_cos or num2cos[item[0]] in enrolled_record[std]:
                    continue
                remain_cnt -= 1
                res[-1].append(num2cos[item[0]])
                if Type == 'test' and std in cur_enrolled:
                    if cur_enrolled[std][int(item[0])] > 0:
                        TP += 1
                        cur_tot -= 1
                    else:
                        FP += 1
                if remain_cnt <= 0:
                    break
            
            if remain_cnt > 0:
                for cos_id in hot_cos:
                    if num2cos[cos_id] not in cur_cos or num2cos[cos_id] in res[-1] or num2cos[cos_id] in enrolled_record[std]:
                        continue
                    remain_cnt -= 1
                    res[-1].append(num2cos[cos_id])
                    if Type == 'test' and std in cur_enrolled:
                        if cur_enrolled[std][int(cos_id)] > 0:
                            TP += 1
                            cur_tot -= 1
                        else:
                            FP += 1
                    if remain_cnt <= 0:
                        break

            if Type == 'test' and std in cur_enrolled:
                FN += cur_tot
        else:
            empt_cnt += 1
            if Type == 'test' and std in cur_enrolled:
                cur_tot = len(cur_enrolled[std][cur_enrolled[std]>0])
            remain_cnt = Top_K
            for cos_id in hot_cos:
                if num2cos[cos_id] not in cur_cos:
                    continue
                remain_cnt -= 1
                res[-1].append(num2cos[cos_id])
                if Type == 'test' and std in cur_enrolled:
                    if cur_enrolled[std][int(cos_id)] > 0:
                        TP += 1
                        cur_tot -= 1
                    else:
                        FP += 1
                if remain_cnt <= 0:
                    break
            if Type == 'test' and std in cur_enrolled:
                FN += cur_tot

    if Type == 'test':
        prec = TP/(TP+FP)
        recall = TP/(TP+FN)
        f_score = 2*TP/(2*TP+FP+FN)
        print(f'Precision {prec}, Recall {recall}, F-score {f_score}, Empty Ratio {empt_cnt/len(all_student)}')
    
    with open(f'{method}_pred.csv', 'w') as f:
        for item in res:
            for record in item:
                f.write(f'"{record}",')
            f.write('\n')
    
    db_res = []
    for item in res:
        db_res.append([item[0], ','.join(item[1:])])
    with open(f'{method}_pred_db.csv', 'w') as f:
        for item in db_res:
            for record in item:
                f.write(f'"{record}",')
            f.write('\n')