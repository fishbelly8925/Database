import func
import numpy as np
import pandas as pd

# Find all cos name which teached by CS as a list
cos=func.findAllCos()

# Find all student name as a list
stds=func.findAllStudent()

# Find the grades of every students as lists in a list
grades=func.findGrades(stds,cos)

# Compute the similarity between every students
similarity=np.zeros((len(stds),len(stds)))
s_len=len(stds)
for a in range(s_len):
    for b in range(s_len):
        similarity[a][b]=func.getSimilarity(grades[a],grades[b])

# Predict the cos score of not pass cos for every student
pred=func.predict(similarity,grades)

# Generate the top K high score of not pass cos for every student
suggest=func.generate(cos,pred,15)

# Fill the empty suggest base on K-Means clustering
func.fillEmpty(suggest,pred)

result=pd.DataFrame(suggest,index=stds)
result.to_csv('RS.csv')