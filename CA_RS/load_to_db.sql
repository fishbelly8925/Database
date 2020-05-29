delete from rs;

load data local infile './KMean_pred_db.csv'
into table rs
fields terminated by ','
enclosed by '"'
lines terminated by '\n';