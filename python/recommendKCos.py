import func
import numpy as np
import pandas as pd


print("The semester you want to recommend (eg:106-1): ",end='')
sem = input()
print("The top K course you want to recommend to users: ",end='')
K = int(input())


# Find all cos name which teached by CS as a list
print("Preparing the data . . .")
cos = func.findAllCos()

# Find all student name as a list
stds = func.findAllStudent()

# Find the grades of every students as lists in a list
grades = func.findGrades(stds, cos)
print("Finish")

# Compute the similarity between every students
print("Getting the similarity between student . . .")
similarity = np.zeros((len(stds), len(stds)))
s_len = len(stds)
for a in range(s_len):
    for b in range(s_len):
        similarity[a][b] = func.getSimilarity(grades[a], grades[b])
print("Finish")

# Predict the cos score of not pass cos for every student
print("Predicting cos score and generate recommend. . .")
pred = func.predict(similarity, grades)

# Generate the top K high score of not pass cos for every student
suggest = func.generate(cos, pred, 30)

# Fill the empty suggest base on K-Means clustering
func.fillEmpty(suggest, pred)
print("Finish")

# Parse the recommend cos with specify semester and K courses
print("Matching the course name . . .")
result = func.parseCurrentCos(stds, suggest, sem, K)
print("Finish")

print("Transfer to csv file . . .")
result=pd.DataFrame(result)
result.to_csv('RS.csv',index=False)