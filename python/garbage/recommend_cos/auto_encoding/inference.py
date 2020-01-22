import model
import pickle
import numpy as np
from dataloader import Auto_Dataset
from dataloader import get_init_dim
import torch
import torch.nn as nn
import torch.utils.data as Data
from tqdm import tqdm

def infer(tot_score, test_stds, top_K = 10):
    cos = nn.CosineSimilarity(dim=0)
    for idx, std in enumerate(test_stds):
        # tot_sim = 0
        test_stds[idx]['pref'] = np.zeros_like(std['input'])
        for other in tot_score:
            sim = cos(std['emb'], other['emb'])
            # tot_sim += sim
            test_stds[idx]['pref'] += sim*other['input']
        test_stds[idx]['pref'][std['input']!=0] = 0
        # test_stds[idx]['pref'] /= tot_sim
        test_stds[idx]['rec_cos'] = test_stds[idx]['pref'].argsort()[-top_K:][::-1]
    return infer

weight_name = 'model_94.pkl'

model = torch.load(weight_name)

with open('data.pkl', 'rb') as f:
    score = pickle.load(f)
Train_Dataset = Auto_Dataset(score, 'train')
Test_Dataset = Auto_Dataset(score, 'test')

tot_score = Train_Dataset.get_all_data()
test_stds = Test_Dataset.get_all_data()

cos = nn.CosineSimilarity(dim=0)