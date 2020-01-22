from torch.utils.data.dataset import Dataset
import numpy as np

cos_init_dim = 0
def get_init_dim():
    return cos_init_dim
class Auto_Dataset(Dataset):
    def __init__(self, score, mode):
        super().__init__()
        self.data = []
        for data in score:
            filtered = data['train_data'][data['train_data']==data['train_data']]
            if filtered.size <2:
                continue
            std = np.std(filtered)
            avg = np.average(filtered)
            changed_record = np.float32(np.nan_to_num((np.array((data['train_data']-avg)/std))))
            if mode == 'train':
                self.data.append({
                    'std_id': data['std_id'],
                    'input': changed_record
                })
            elif mode == 'test' and data['test_ground'][0]!=None:
                self.data.append({
                    'std_id': data['std_id'],
                    'input': changed_record,
                    'output': np.nan_to_num(data['test_ground'])
                })
        global cos_init_dim
        cos_init_dim = len(changed_record)

    def __getitem__(self, index):
        return self.data[index]
    
    def __len__(self):
        return len(self.data)
    
    def get_all_data(self):
        return self.data