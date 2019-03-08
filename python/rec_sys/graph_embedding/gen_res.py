import numpy as np
import func
import pandas as pd

K = 10
std = []        # student_id
id_list = []    # map id with student
vector = []     # map latent

mode = input('Enter the mode (a: for undergraduated course, b: for graduated course) : ')
sem = input('Enter the semester: ')

# pick up student id and id of student in map
with open('id_pair_list') as r:
    temp = r.readline()
    while temp:
        if temp[0]=='0' or temp[0]=='9':
            temp = temp.split(',')
            std.append(temp[0])
            id_list.append(temp[1][:-1])
        temp = r.readline()

model_output = []
# read all student and cos map vector
with open('o_4243.csv') as r:
    temp = r.readline()
    temp = r.readline()
    while temp:
        model_output.append(np.array(temp[:-1].split(',')[1:]).astype(float))
        temp = r.readline()

# select vector of student in map
for idx in id_list:
    vector.append(model_output[int(idx)])


def loss_func(x,y):
    return (np.mean((x-y)**2))**0.5

# = = = = = = = = = = = = = = = = = = =

# get similarity
std_len = len(std)
similarity = np.zeros((std_len, std_len))
for a in range(std_len):
    for b in range(std_len)[a:]:
        if a==b:
            similarity[a][b] = 0
        else:
            # similarity[a][b] = func.getSimilarity(encoded[a], encoded[b])
            similarity[a][b] = -1*loss_func(vector[a], vector[b])
            similarity[b][a] = -1*loss_func(vector[b], vector[a])

# = = = = = = = = = = = = = = = = = = =

allCos = func.findAllCos()
score = func.findGrades(std,allCos)
score = np.float32(np.nan_to_num(score))

# start predict
pred = func.predict(similarity, score)
# Generate the top K high score of not pass cos for every student
suggest = func.generate(allCos, pred, 70)

# Parse the recommend cos with specify semester and K courses
result = func.parseCurrentCos_withMode(std, suggest, sem, K, mode)

print("Transfer to csv file . . .")
result=pd.DataFrame(result)

if mode=='a':
	result.to_csv('RS_graph_under.csv', index=False)
elif mode=='b':
	result.to_csv('RS_graph_graduated.csv', index=False)