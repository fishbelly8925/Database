import torch
import torch.nn as nn
import torch.utils.data as Data
import torchvision
import func
import numpy as np


# Hyper parameter
MIN_COS_NUM = 0
EPOCH = 10
ITER_TIMES = 3
BATCH_SIZE = 30
LR = 0.005
DROP_PROB = 0.8

# Data prepare
score = func.findGrades(func.findAllStudent(),func.findAllCos())
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
			nn.Linear(len(score[0]),128),
			nn.ELU(),
			nn.Linear(128,64),
			nn.ELU(),
			nn.Linear(64,12),
			nn.ELU(),
			nn.Linear(12,3),
			nn.ELU()
		)
		self.decoder = nn.Sequential(
			nn.Linear(3,12),
			nn.ELU(),
			nn.Linear(12,64),
			nn.Dropout(DROP_PROB),
			nn.ELU(),
			nn.Linear(64,128),
			nn.Dropout(DROP_PROB),
			nn.ELU(),
			nn.Linear(128,len(score[0])),
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
	for epoch in range(EPOCH):
		for step, x in enumerate(train_loader):
			b_x = x.view(-1, len(score[0]))
			b_y = x.view(-1, len(score[0]))

			for times in range(ITER_TIMES):
				encodded, decoded = autoencoder.forward(b_x)
				loss = loss_func(decoded,b_y)
				loss.backward(retain_graph=True)
				optimizer.step()
				optimizer.zero_grad()
				b_y = b_x
				b_x = decoded

			print('Epoch ',epoch,' | train_lose: {0:4f}'.format(loss.data.numpy()))

	torch.save(autoencoder,'net.pkl')