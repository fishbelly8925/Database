load data local infile '/home/nctuca/db_data/scrapCosTea/cos_data.csv'
into table cos_data
fields terminated by ','
enclosed by '"'
lines terminated by '\n'
ignore 1 lines;

load data local infile '/home/nctuca/db_data/scrapCosTea/cos_name.csv'
into table cos_name
fields terminated by ','
enclosed by '"'
lines terminated by '\n'
ignore 1 lines;

load data local infile '/home/nctuca/db_data/scrapCosTea/TeacherList.csv'
into table teacher_cos_relation
fields terminated by ','
enclosed by '"'
lines terminated by '\n'
ignore 1 lines;
