import func
import json

sem = '107-1'
current_cos = func.findCurrentCos(sem)	# current cos name
all_cos = func.findAllCos()				# all cos name
all_student_id = func.findAllStudent()	# all student id

# set graph id corresponding to student_id and cos_name
id_pair = dict()
max_id = 0
for std_id in all_student_id:
	id_pair[std_id] = max_id
	max_id+=1
for cos_name in all_cos:
	id_pair[cos_name] = max_id
	max_id+=1

# get student_id and it's passed cos name
# translate it to graph id
id_cos_pair = func.findIdCos()
res_pair = dict()
for std_id, coses in id_cos_pair.items():
	cos = []
	for i in coses:
		cos.append(str(id_pair[i]))
	graph_id = str(id_pair[std_id])
	res_pair[graph_id] = cos

# output json file
with open('input.json', 'w') as f:
	f.write(json.dumps(res_pair))

# output csv file
with open('input.csv', 'w') as f:
	for std_id, coses in res_pair.items():
		for cos in coses:
			f.writelines(std_id + ',' + cos + '\n')