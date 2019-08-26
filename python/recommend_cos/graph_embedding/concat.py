files = ['RS_graph_Attention_under.csv', 'RS_graph_Attention_graduated.csv']
data = ''
with open(files[0]) as f1:
    with open(files[1]) as f2:
        for line in zip(f1.readlines()[1:], f2.readlines()[1:]):
            a = line[0].split(',')
            b = line[1].split(',')
            data += a[0]+','+'"'
            for i in a[1:]:
                i = i.replace('\n', '')
                if i == '':
                    break
                data += i+','
            for i in b[1:]:
                i = i.replace('\n', '')
                if i == '':
                    break
                data += i+','
            data += '"\n'

with open('RS_final.csv', 'w') as f:
    f.write(data)