curl -o TeacherList https://dcpc.nctu.edu.tw/plug/n/nctup/TeacherList
python3 ./json_to_csv.py TeacherList
rm TeacherList

fileName='106-2'
acy=${fileName:0:3}
sem=${fileName:4}

while [ -e $acy-$sem.csv ]
do
	sem=$(($sem+1))
	if [ ${sem} -gt 3 ];then
		sem=1
		acy=$(($acy+1))
	fi
done
echo $acy
echo $sem

sem2=$(($sem+1))
if [ ${sem2} -gt 3 ];then
	acy2=$(($acy+1))
	sem2=1
else
	acy2=$acy
fi

a=$(curl --get -d "acy=$acy2&sem=$sem2" https://dcpc.nctu.edu.tw/plug/n/nctup/CourseList)
fileName=${acy2}-${sem2}
if [ "$a" == "[]" ];then
	a=$(curl --get -d "acy=$acy&sem=$sem" https://dcpc.nctu.edu.tw/plug/n/nctup/CourseList)
	fileName=${acy}-${sem}
fi

echo $fileName
echo $a > $fileName
python3 ./json_to_csv.py $fileName
rm $fileName
python3 ./generate_single_cos_data.py $fileName.csv

delCD="delete from cos_data where unique_id like '$fileName%'"
delCN="delete from cos_name where unique_id like '$fileName%'"
mysql -uroot -ppwd -D haha -e "$delCD"
mysql -uroot -ppwd -D haha -e "$delCN"
mysql -uroot -ppwd -D haha < update_cos_data.sql