import func
import pickle
import numpy as np
import json
from wordcloud import WordCloud
import PIL.Image as image
import matplotlib.pyplot as plt

from sklearn.cluster import DBSCAN
from sklearn.cluster import SpectralClustering
from sklearn.cluster import KMeans

##############################
Number_Of_Cluster = 30
##############################

def show_cluster_res(data, std_list, cluster, num_to_cos, method):
    clu_stds_list = []
    clu_cos_idx_list = []
    for clu_idx in range(cluster.labels_.max()+1):
        clu_cos_idx_list.append([])

        idx = np.where(cluster.labels_ == clu_idx)
        clu_stds_list.append(std_list[idx].tolist())
        cos_list = []
        sum_data = data[idx].sum(axis=0)
        cos_idxes = np.where(sum_data > 0)
        for cos_idx in cos_idxes[0]:
            clu_cos_idx_list[-1].append((str(cos_idx), float(sum_data[cos_idx])))
            cos_list.extend([num_to_cos[cos_idx]]*int(sum_data[cos_idx]))

        clu_cos_idx_list[-1].sort(key = lambda x: x[1], reverse=True)
        if not cos_list:
            continue
    ##############################################
    res = dict()
    for idx, (stds, coses) in enumerate(zip(clu_stds_list, clu_cos_idx_list)):
        for std in stds:
            res[std] = coses
    ###########################
    std_cnt = [len(stds) for stds in clu_stds_list]
    plt.bar(range(len(std_cnt)), std_cnt)
    plt.xlabel('Cluster Idx')
    plt.ylabel('Student Number')
    plt.title(f'{method} Student Number')
    plt.savefig(f'res/{method}.png')
    plt.close()
    ###########################
    with open(f'res/{method}.json', 'w') as f:
        json.dump(res, f, indent=4)

all_student = func.Student_fromScore()
all_cos = func.findAllCos()
cos_to_num = {}
num_to_cos = {}
with open('cos_to_num.json', 'w') as f1, open('num_to_cos.json', 'w') as f2:
    for i in range(len(all_cos)):
        cos_to_num[all_cos[i]] = i
        num_to_cos[i] = all_cos[i]
    json.dump(cos_to_num, f1, indent=4, ensure_ascii=False)
    json.dump(num_to_cos, f2, indent=4, ensure_ascii=False)

score = func.findGrads(all_student, all_cos)
data = np.stack([i['data'] for i in score])
std_list = np.stack([i['std_id'] for i in score])
print('Spectral Clustering')
clustering = SpectralClustering(n_clusters=Number_Of_Cluster, affinity='nearest_neighbors').fit(data)
show_cluster_res(data, std_list, clustering, num_to_cos, method='Spectral')

print('KMeans')
clustering = KMeans(n_clusters=Number_Of_Cluster, algorithm='full', max_iter=1000).fit(data)
show_cluster_res(data, std_list, clustering, num_to_cos, method='KMean')

##############################
## Store the courses students have enrolled
res = dict()
for item in score:
    cos_idxes = np.where(item['data'] != 0)[0].tolist()
    res[str(item['std_id'])] = []
    for idx in cos_idxes:
        res[str(item['std_id'])].append(num_to_cos[idx])
with open('std_cos_record.json', 'w', encoding='UTF-8') as f:
    json.dump(res, f, indent=4)

##############################
## Hot Course
sum_res = data.sum(axis=0)
cos_idxes = np.where(sum_res > 0)
order = [(cos_id, score) for cos_id, score in zip(cos_idxes[0], sum_res[cos_idxes])]
order.sort(key=lambda x: x[1], reverse=True)
res = [str(item[0]) for item in order]
with open('hot_cos.json', 'w') as f:
    json.dump(res, f, indent=4)