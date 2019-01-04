
data = ''
with open('RS_auto_final.csv', 'r') as f:
	for line in f.readlines():
		temp = line.split(',')
		cos = '"'
		for i in temp[1:-1]:
			cos += i+','
		cos += temp[-1]+'"'
		data += temp[0]+','+cos+'\n'

with open('RS_auto_final_ch.csv','w') as f:
	f.write(data)