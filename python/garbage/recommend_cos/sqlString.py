# findAllCos = "\
# 	select distinct cn.cos_cname from \
# 	(\
# 		select unique_id\
# 		from cos_data\
# 		where cos_code like 'DCP%' \
# 		or cos_code like 'IOC%' \
# 		or cos_code like 'IOE%' \
# 		or cos_code like 'ILE%' \
# 		or cos_code like 'IDS%' \
# 		or cos_code like 'CCS%' \
# 		or cos_code like 'ICP%'\
# 	) as id,\
# 	(\
# 		select unique_id, cos_cname \
# 		from cos_name\
# 	) as cn\
# 	where id.unique_id = cn.unique_id;"

findAllCos = "\
	select distinct cos_cname \
	from cos_name\
	where cos_code like 'DCP%' \
		or cos_code like 'IOC%' \
		or cos_code like 'IOE%' \
		or cos_code like 'ILE%' \
		or cos_code like 'IDS%' \
		or cos_code like 'CCS%' \
		or cos_code like 'ICP%';"

findGrad = "\
	select cn.cos_cname, sc.score \
	from \
	(\
		select cos_year, semester, cos_id, score \
		from cos_score \
		where student_id = %(id)s \
		and score_type != '通過不通過' \
		and pass_fail != 'W' \
	) as sc ,\
	(\
		select unique_id, cos_cname \
		from cos_name\
	) as cn \
	where cn.unique_id = concat(sc.cos_year,'-',sc.semester,'-',sc.cos_id);"

findCurrentCos = "\
	select distinct cn.cos_cname\
	from\
	(\
		select unique_id from cos_data\
		where unique_id like concat(%(sem)s,'%%')\
		and\
		(\
			cos_code like 'DCP%%'\
			or cos_code like 'IOC%%'\
			or cos_code like 'IOE%%'\
			or cos_code like 'ILE%%'\
			or cos_code like 'IDS%%'\
			or cos_code like 'CCS%%'\
			or cos_code like 'ICP%%'\
		)\
		and\
		(\
			cos_code not like 'DCP%%'\
			or cos_type != '必修'\
		)\
	) as id ,\
	(\
		select unique_id, cos_cname\
		from cos_name\
		where cos_cname not like '博士%%'\
	) as cn\
	where id.unique_id = cn.unique_id;"

findCurrentBasicCos = "\
	select distinct cn.cos_cname\
	from\
	(\
		select unique_id from cos_data\
		where unique_id like concat(%(sem)s,'%%')\
		and cos_code like 'DCP%%'\
		and cos_type != '必修'\
	) as id ,\
	(\
		select unique_id, cos_cname\
		from cos_name\
		where cos_cname not like '博士%%'\
	) as cn\
	where id.unique_id = cn.unique_id;"

findCurrentAdvanceCos = "\
	select distinct cn.cos_cname\
	from\
	(\
		select unique_id from cos_data\
		where unique_id like concat(%(sem)s,'%%')\
		and\
		(\
			cos_code like 'IOC%%'\
			or cos_code like 'IOE%%'\
			or cos_code like 'ILE%%'\
			or cos_code like 'IDS%%'\
			or cos_code like 'CCS%%'\
			or cos_code like 'ICP%%'\
		)\
	) as id ,\
	(\
		select unique_id, cos_cname\
		from cos_name\
		where cos_cname not like '博士%%'\
	) as cn\
	where id.unique_id = cn.unique_id;"