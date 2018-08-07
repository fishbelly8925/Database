import torch
import torch.nn as nn
import auto_training as at
import func
import numpy as np
import csv

sem = input('Enter the semester: ')

# parameter
INF = 123.0

# prepare data and model
score = torch.FloatTensor(at.score)
stds = func.findAllStudent()
allCos = func.findAllCos()
currentCos = func.findCurrentCos(sem)
AutoEncoder = at.AutoEncoder

autoencoder = torch.load('net.pkl')

# start predict
_, decoded = autoencoder.forward(score)
decoded = decoded.detach().numpy()
score = score.numpy()
decoded[score!=0] = -INF
res = func.generate(allCos, decoded, 30)
res = func.parseCurrentCos(stds, res, sem, 7)


# write to file

with open('RS_auto.csv','w') as out:
	writer = csv.writer(out)
	writer.writerows(res)