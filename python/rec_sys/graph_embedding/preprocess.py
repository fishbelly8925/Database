import func
import json

sem = '107-2'
current_cos = func.findCurrentCos(sem)	# current cos name
all_cos = func.findAllCos()				# all cos name
all_student_id = func.findAllStudent()	# all student id

## set up id pair in graph
## get student_id and it's passed cos name
## translate it to graph id
id_pair = dict()	# graph id pair
max_id = 0
id_cos_pair = func.findIdCos()
res_pair = dict()
for std_id, coses in id_cos_pair.items():
	if std_id not in id_pair:
		id_pair[std_id] = max_id
		max_id+=1
	cos = []
	for i in coses:
		if i not in id_pair:
			id_pair[i] = max_id
			max_id+=1
		cos.append(str(id_pair[i]))
	graph_id = str(id_pair[std_id])
	res_pair[graph_id] = cos

## output json file
with open('input.json', 'w') as f:
	f.write(json.dumps(res_pair))

## output csv file
with open('input.csv', 'w') as f:
	f.writelines('node_1,node_2\n')
	for std_id, coses in res_pair.items():
		for cos in coses:
			f.writelines(std_id + ',' + str(cos) + '\n')

## output id_pair likst
with open('id_pair_list', 'w') as f:
	for key, value in id_pair.items():
		f.writelines(key + ',' + str(value) + '\n')