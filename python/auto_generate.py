import torch
import torch.nn as nn
import auto_training as at
import func

# fake data
data = torch.FloatTensor([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,
 0,0,3,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1,2,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,0,0,0,2,0,0,0,0,
 1,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,0,
 3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,2,0,
 0,2,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,3,3,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,0,0,
 0,0,0,0,0,0,0,0])
AutoEncoder = at.AutoEncoder

autoencoder = torch.load('net.pkl')
encoded,decoded = autoencoder.forward(data)
print(encoded)
print(data)
print(decoded)
print(at.loss_func(data,decoded))