import func
import pickle

test_year_sem_list = ['107-1', '107-2']
score = func.findGrads(func.findAllStudent_fromScore(), func.findAllCos(), test_year_sem_list)
with open('data.pkl', 'wb') as f:
    pickle.dump(score, f)