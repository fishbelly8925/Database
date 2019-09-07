findAllCos = "\
	select distinct cos_cname \
	from cos_name\
	where (cos_code like 'DCP%' \
		or cos_code like 'IOC%' \
		or cos_code like 'IOE%' \
		or cos_code like 'ILE%' \
		or cos_code like 'IDS%' \
		or cos_code like 'CCS%' \
		or cos_code like 'ICP%')\
		and cos_cname not like '博士班書報%'\
        and cos_cname not like '論文研討%'\
        and cos_cname not like '個別研究%'\
        and cos_cname not like '博士學位%'\
        and cos_cname not like '教學實務%'\
        and cos_cname not like '資訊工程研討%'\
        and cos_cname not like '資訊工程專題%'\
        and cos_cname not like '%導師時間%'\
        and cos_cname not like '跨領域專題%'\
        and cos_cname not like '服務學習%'; "

findGradAvgStd = "\
	select cn.unique_id, CAST(AVG(sc.score) AS Float) as avg_score, STD(sc.score) as std_score \
	from \
	(\
		select cos_year, semester, cos_id, score \
		from cos_score \
		where score_type != '通過不通過' \
		and pass_fail != 'W' \
	) as sc, \
	(\
		select unique_id, cos_cname \
		from cos_name\
		where (cos_code like 'DCP%' \
		or cos_code like 'IOC%' \
		or cos_code like 'IOE%' \
		or cos_code like 'ILE%' \
		or cos_code like 'IDS%' \
		or cos_code like 'CCS%' \
		or cos_code like 'ICP%')\
		and cos_cname not like '博士班書報%'\
        and cos_cname not like '論文研討%'\
        and cos_cname not like '個別研究%'\
        and cos_cname not like '博士學位%'\
        and cos_cname not like '教學實務%'\
        and cos_cname not like '資訊工程研討%'\
        and cos_cname not like '資訊工程專題%'\
        and cos_cname not like '%導師時間%'\
        and cos_cname not like '跨領域專題%'\
        and cos_cname not like '服務學習%'\
	) as cn \
	where cn.unique_id = concat(sc.cos_year,'-',sc.semester,'-',sc.cos_id)\
	group by cn.unique_id;"

findGrad = "\
	select cn.unique_id, cn.cos_cname, sc.score \
	from \
	(\
		select cos_year, semester, cos_id, score \
		from cos_score \
		where student_id = %(id)s \
		and score_type != '通過不通過' \
		and pass_fail != 'W' \
	) as sc, \
	(\
		select unique_id, cos_cname \
		from cos_name\
		where (cos_code like 'DCP%%' \
		or cos_code like 'IOC%%' \
		or cos_code like 'IOE%%' \
		or cos_code like 'ILE%%' \
		or cos_code like 'IDS%%' \
		or cos_code like 'CCS%%' \
		or cos_code like 'ICP%%')\
		and cos_cname not like '博士班書報%%'\
        and cos_cname not like '論文研討%%'\
        and cos_cname not like '個別研究%%'\
        and cos_cname not like '博士學位%%'\
        and cos_cname not like '教學實務%%'\
        and cos_cname not like '資訊工程研討%%'\
        and cos_cname not like '資訊工程專題%%'\
        and cos_cname not like '%%導師時間%%'\
        and cos_cname not like '跨領域專題%%'\
        and cos_cname not like '服務學習%%'\
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