base_path='/home/nctuca/dinodino-extension/db_data/crawlCosData'

curl -o ${base_path}/TeacherList https://dcpc.nctu.edu.tw/plug/n/nctup/TeacherList
python3 ${base_path}/json_to_csv.py ${base_path}/TeacherList

fileName='107-1'
acy=${fileName:0:3}
sem=${fileName:4}

while [ -e ${base_path}/${acy}-${sem}.csv ]
do
	sem=$((${sem}+1))
	if [ ${sem} -gt 3 ];then
		sem=1
		acy=$((${acy}+1))
	fi
done

sem2=$((${sem}-1))
if [ ${sem2} -eq 0 ];then
	acy2=$((${acy}-1))
	sem2=1
else
	acy2=${acy}
fi

a=$(curl --get -d "acy=${acy}&sem=${sem}" https://dcpc.nctu.edu.tw/plug/n/nctup/CourseList)
fileName=${acy}-${sem}
if [ "${a}" == "[]" ];then
    a=$(curl --get -d "acy=${acy2}&sem=${sem2}" https://dcpc.nctu.edu.tw/plug/n/nctup/CourseList)
	fileName=${acy2}-${sem2}
    acy=${acy2}
    sem=${sem2}
fi

echo "Processing ${fileName}"
echo ${a} > ${base_path}/${fileName}
python3 ${base_path}/json_to_csv.py ${base_path}/${fileName}
rm ${base_path}/${fileName}
python3 ${base_path}/generate_single_cos_data.py ${base_path}/${fileName}.csv



if [ "${sem}" == "3" ]; then
    new_fileName="${acy}-X"
    echo "Replace ${fileName} to ${new_fileName}"
    fileName=${new_fileName}
fi

delCD="delete from cos_data where unique_id like '${fileName}%'"
delCN="delete from cos_name where unique_id like '${fileName}%'"
mysql -uroot -phaha -D yee -e "${delCD}"
mysql -uroot -phaha -D yee -e "${delCN}"
mysql -uroot -phaha -D yee < ${base_path}/update_cos_data.sql
