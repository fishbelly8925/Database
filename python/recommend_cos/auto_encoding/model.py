import torch
import torch.nn as nn

class AutoEncoder(nn.Module):
    def __init__(self, init_dim, drop_rate):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(init_dim, 100),
            nn.ReLU(),
            nn.Linear(100, 50)
        )
        self.decoder = nn.Sequential(
            nn.Linear(50, 100),
            nn.Dropout(drop_rate),
            nn.ReLU(),
            nn.Linear(100, init_dim)
        )
    def forward(self, x):
        enc = self.encoder(x)
        dec = self.decoder(enc)
        return enc, dec