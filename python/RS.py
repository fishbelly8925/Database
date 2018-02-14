import func
import numpy as np
import pandas as pd

cos=func.findAllCos()

stds=func.findAllStudent()

grads=func.findGrades(stds,cos)

similarity=np.zeros((len(stds),len(stds)))
s_len=len(stds)
for a in range(s_len):
    for b in range(s_len):
        similarity[a][b]=func.getSimilarity(grads[a],grads[b])

pred=func.predict(similarity,grads)

suggest=func.generate(cos,pred,10)

result=pd.DataFrame(suggest,index=stds)
result.to_csv('RS.csv')