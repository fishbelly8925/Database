import model
import pickle
import numpy as np
from dataloader import Auto_Dataset
from dataloader import get_init_dim
import torch
import torch.nn as nn
import torch.utils.data as Data
from tqdm import tqdm
from sklearn.metrics import precision_recall_fscore_support

####
Batch_size = 64
Epoch = 100
LR = 0.01
####

def list_to_onehot(input_list, app_term_num):
    one_hot = np.zeros((len(input_list), app_term_num))
    for i in range(len(input_list)):
        if len(input_list[i]) == 0:
            continue
        one_hot[i, input_list[i]] = 1
    return one_hot


def cal_score(preds, gold):
    score = []
    for pred in preds:
        TP = 0
        TPFP = len(pred)
        TPFN = len(gold)
        for g_cos in gold:
            if g_cos in pred:
                TP += 1
        prec = TP/TPFP
        recall = TP/TPFN
        score.append({
            'f1': 2*TP/(TPFP+TPFN),
            'prec': prec,
            'recall': recall
        })
    return score

with open('data.pkl', 'rb') as f:
    score = pickle.load(f)
Train_Dataset = Auto_Dataset(score, 'train')
Test_Dataset = Auto_Dataset(score, 'test')

tot_score = Train_Dataset.get_all_data()
test_stds = Test_Dataset.get_all_data()

print(f'tot len: {len(tot_score)}')
print(f'test len: {len(test_stds)}')

Train_Loader = Data.DataLoader(
    dataset = Train_Dataset,
    batch_size = Batch_size,
    shuffle = True,
    num_workers = 2
)
Loss = torch.nn.MSELoss()
auto_model = model.AutoEncoder(get_init_dim())
optimizer = torch.optim.SGD(auto_model.parameters(), lr=LR, momentum=0.8)
cos = nn.CosineSimilarity(dim=0)

top_list = [1, 5, 10, 15]


for epoch in range(Epoch):
    print(f'Epoch {epoch}')
    tot_loss = 0
    for data in Train_Loader:
        _, dec = auto_model(data['input'])
        loss = Loss(data['input'], dec)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        tot_loss += loss.detach()
    tot_loss /= len(Train_Loader)
    print(f'Train loss {tot_loss}')

    with torch.no_grad():
        for idx, data in enumerate(tot_score):
            emb, _ = auto_model(torch.tensor(data['input']))
            tot_score[idx]['emb'] = emb
        
        res_scores = [{
            'f1': 0,
            'prec': 0,
            'recall': 0
        }]*len(top_list)
        tot_rec_cos = [] #Top1, Top5, Top10, Top15
        tot_ground = []
        for idx, std in enumerate(test_stds):
            # rec_cos = [] #Top1, Top5, Top10, Top15
            emb, _ = auto_model(torch.tensor(std['input']))
            test_stds[idx]['pref'] = np.zeros_like(std['input'])
            for other in tot_score:
                sim = cos(emb, other['emb']).numpy()
                test_stds[idx]['pref'] += sim*other['input']
            test_stds[idx]['pref'][std['input']!=0] = 0

            ground = np.where(std['output']!=0)[0].tolist()
            for top_idx, top in enumerate(top_list):
                if len(tot_rec_cos) <= top_idx:
                    tot_rec_cos.append([])
                tot_rec_cos[top_idx].append(test_stds[idx]['pref'].argsort()[-top:][::-1])
            tot_ground.append(ground)

            # scores = cal_score(rec_cos, ground)
            # for idx, score in enumerate(scores):
            #     res_scores[idx]['f1'] += score['f1']
            #     res_scores[idx]['prec'] += score['prec']
            #     res_scores[idx]['recall'] += score['recall']
        
        mapping = {}
        ground_list = []
        pred_list = []
        test_len = len(test_stds)
        for top_num, rec_cos in zip(top_list, tot_rec_cos):
            for ground_coses, pred_coses in zip(tot_ground, rec_cos):
                for g_cos in ground_coses:
                    g_cos = int(g_cos)
                    if g_cos not in mapping:
                        mapping[g_cos] = len(mapping)
                for p_cos in pred_coses:
                    p_cos = int(p_cos)
                    if p_cos not in mapping:
                        mapping[p_cos] = len(mapping)
                ground_list.append(np.array([mapping[int(i)] for i in ground_coses]))
                pred_list.append(np.array([mapping[int(i)] for i in pred_coses]))
            ground_one_hot = list_to_onehot(ground_list, len(mapping))
            pred_one_hot = list_to_onehot(pred_list, len(mapping))
            mac_prec, mac_recal, mac_f1, _ = precision_recall_fscore_support(ground_one_hot, pred_one_hot, average='macro') 
            mic_prec, mic_recal, mic_f1, _ = precision_recall_fscore_support(ground_one_hot, pred_one_hot, average='micro') 
   

            with open(f'record/res_top{top_num}.csv', 'a') as f:
                if epoch == 0:
                    line = 'train_loss'
                    line += f',top{top_num} mac_f1'
                    line += f',top{top_num} mac_prec'
                    line += f',top{top_num} mac_recall'
                    line += f',top{top_num} mic_f1'
                    line += f',top{top_num} mic_prec'
                    line += f',top{top_num} mic_recall'
                    f.write(line+'\n')

                line = f'{tot_loss:.6}'
                
                line += f",{mac_f1:.6}"
                line += f",{mac_prec:.6}"
                line += f",{mac_recal:.6}"
                line += f",{mic_f1:.6}"
                line += f",{mic_prec:.6}"
                line += f",{mic_recal:.6}"
                f.write(line+'\n')
    
    torch.save(auto_model, f'model_{epoch}.pkl')