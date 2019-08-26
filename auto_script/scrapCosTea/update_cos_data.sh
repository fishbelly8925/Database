base_path='/home/nctuca/db_data/scrapCosTea'

curl -o ${base_path}/TeacherList https://dcpc.nctu.edu.tw/plug/n/nctup/TeacherList
python3 ${base_path}/json_to_csv.py ${base_path}/TeacherList

fileName='107-2'
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
echo ${acy}
echo ${sem}

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
fi

echo ${fileName}
echo ${a} > ${base_path}/${fileName}
python3 ${base_path}/json_to_csv.py ${base_path}/${fileName}
rm ${base_path}/${fileName}
python3 ${base_path}/generate_single_cos_data.py ${base_path}/${fileName}.csv

delCD="delete from cos_data where unique_id like '${fileName}%'"
delCN="delete from cos_name where unique_id like '${fileName}%'"
mysql -uroot -ppsw -D hahaha -e "${delCD}"
mysql -uroot -ppsw -D hahaha -e "${delCN}"
mysql -uroot -ppsw -D hahaha < ${base_path}/update_cos_data.sql
