# import model
import func
import numpy as np

score = func.findGrads(func.findAllStudent_fromScore(),func.findAllCos())
normal_score = []
for data in score:
    filtered = data[data==data]
    if filtered.size == 0:
        continue
    std = np.std(filtered)
    if std == 0:
        std = 1
    avg = np.average(filtered)
    normal_score.append((data-avg)/std)
normal_score = np.array(normal_score)
normal_score = np.float32(np.nan_to_num(normal_score))
