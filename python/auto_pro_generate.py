import torch
import torch.nn as nn
import auto_training as at
import func
import numpy as np
import csv
import pandas as pd

sem = input('Enter the semester: ')

# parameter
INF = 123.0
K = 10

# prepare data and model
stds = func.findAllStudent()
allCos = func.findAllProCos()
score = func.findGrades(stds,allCos)
score = np.float32(np.nan_to_num(score))
score = torch.FloatTensor(score)
currentCos = func.findCurrentCos(sem)
AutoEncoder = at.AutoEncoder
autoencoder = torch.load('net_pro.pkl')

def loss_func(x,y):
	return (np.mean((x-y)**2))**0.5

# start encode
print('Encoding')
encoded, _ = autoencoder(score)
encoded = encoded.detach().numpy()
# get similarity
print('Getting Similarity')
s_len = len(encoded)
similarity = np.zeros((s_len, s_len))
for a in range(s_len):
	for b in range(s_len):
		if a==b:
			similarity[a][b] = 0
		else:
			# similarity[a][b] = func.getSimilarity(encoded[a], encoded[b])
			similarity[a][b] = -1*loss_func(encoded[a], encoded[b])

# start predict
score = score.numpy()
pred = func.predict(similarity, score)
# Generate the top K high score of not pass cos for every student
suggest = func.generate(allCos, pred, 50)

# Parse the recommend cos with specify semester and K courses
result = func.parseCurrentCos(stds, suggest, sem, K)

print("Transfer to csv file . . .")
result=pd.DataFrame(result)
result.to_csv('RS_auto_pro.csv',index=False)