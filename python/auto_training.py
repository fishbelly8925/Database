import torch
import torch.nn as nn
import torch.utils.data as Data
import torchvision
import func
import numpy as np


# Hyper parameter
MIN_COS_NUM = 0
EPOCH = 100
ITER_TIMES = 5
BATCH_SIZE = 30
LR = 0.0001
DROP_PROB = 0.2

# Data prepare
score = func.findGrades(func.findAllStudent_byGrades(),func.findAllCos())
score = np.float32(np.nan_to_num(score))
cond = np.sum(score!=0,axis=1)>MIN_COS_NUM
score = score[cond]
train_loader = Data.DataLoader(dataset=score, batch_size=BATCH_SIZE,
	shuffle=True)

# NN define
class AutoEncoder(nn.Module):
	def __init__(self):
		super(AutoEncoder,self).__init__()

		self.encoder = nn.Sequential(
			nn.Linear(len(score[0]),500),
			nn.ELU(),
			nn.Linear(500,200),
			nn.ELU(),
			nn.Linear(200,50),
			nn.ELU()
		)
		self.decoder = nn.Sequential(
			nn.Linear(50,200),
			nn.ELU(),
			nn.Linear(200,500),
			nn.Dropout(DROP_PROB),
			nn.ELU(),
			nn.Linear(500,len(score[0])),
			nn.ELU()
		)

	def forward(self,x):
		encoded = self.encoder(x)
		decoded = self.decoder(encoded)
		return encoded, decoded

autoencoder = AutoEncoder()
optimizer = torch.optim.Adam(autoencoder.parameters(),lr=LR)
def loss_func(x,y):
	return (torch.mean((x-y)**2))**0.5


# Training
if __name__ == '__main__':
	loader_len = len(train_loader)
	for epoch in range(EPOCH):
		total_loss = 0
		for step, x in enumerate(train_loader):
			b_x = x.view(-1, len(score[0]))
			b_y = x.view(-1, len(score[0]))
			for times in range(ITER_TIMES):
				encodded, decoded = autoencoder(b_x)
				loss = loss_func(decoded,b_y)
				total_loss += loss
				loss.backward(retain_graph=True)
				optimizer.step()
				optimizer.zero_grad()
				b_y = b_x
				b_x = decoded
		print('Epoch ',epoch,' | train_lose: {0:4f}'.format(total_loss/ITER_TIMES/loader_len))
		if epoch%5==1:
			torch.save(autoencoder,'net2.pkl')

	torch.save(autoencoder,'net2.pkl')