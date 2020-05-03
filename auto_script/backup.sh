Store_dir='/home/nctuca/dinodino-extension/db_backup'
Max_back_file_num=42
####################################
now="$(date +'%Y %m %d %T')"
year=$(echo ${now} | cut -d" " -f1)
mon=$(echo ${now} | cut -d" " -f2)
day=$(echo ${now} | cut -d" " -f3)
hr=$(echo ${now} | cut -d" " -f4 | cut -d":" -f1)

file_name='CADB_'${year}${mon}${day}${hr}

files=$(ls ${Store_dir} | grep CADB)
num=$(echo ${files} | grep -o CADB | wc -l)

if [ ${num} -ge ${Max_back_file_num} ];then
    first_file=$(echo ${files} | cut -d" " -f1)
    rm ${Store_dir}/${first_file}
fi
mysqldump -uroot -ppsw hahaha > ${Store_dir}/${file_name}
