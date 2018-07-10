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
suggest=func.generate(cos,pred,30)

# Fill the empty suggest base on K-Means clustering
func.fillEmpty(suggest,pred)

current_cos=func.findCurrentCos()
for i in range(len(suggest)):
	temp=list(filter(lambda x: x in current_cos,suggest[i]))
	if len(temp)>7:
		temp=temp[0:7]
	string=""
	for j in temp:
		string+=str(j)+','
	suggest[i]=string[0:-1]

result=pd.DataFrame(suggest,index=stds)
result.to_csv('RS.csv')