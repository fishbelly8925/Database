import json
import sys
from collections import OrderedDict 

for file in sys.argv[1:]:
	with open(file) as f:
		data=json.load(f,object_pairs_hook=OrderedDict)
	with open(file+'.csv','w') as f:
		for i in list(data[0].keys())[0:-1]:
			f.write('\"'+i+'\"'+',')
		f.write(list(data[0].keys())[-1]+'\n')
		for i in data:
			last=list(i.keys())[-1]  #find the last key value
			for j,k in i.items():
				if type(k)==str:
					f.write('\"'+k+'\"') # use quotation marks to cover the string
				else:
					f.write(str(k))
				if j==last: # judge the key value to print comma or newline
					f.write('\n')
				else:
					f.write(',')