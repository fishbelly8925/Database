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
        and cos_cname not like '服務學習%'\
		and ( unique_id like '107%'\
			or unique_id like '106%'\
			or unique_id like '105%'\
			or unique_id like '104%'\
			or unique_id like '103%'\
			)\
	order by cos_cname; "

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

findCurCos = "\
	select distinct cos_cname\
	from cos_name\
	where unique_id like concat('{prefix}','%') and (cos_code like 'DCP%' \
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
	order by cos_cname;"

findGrad = "\
	select cn.unique_id, cn.cos_cname, sc.score \
	from \
	(\
		select cos_year, semester, cos_id, score \
		from cos_score \
		where student_id = '{id}' \
		and score_type != '通過不通過' \
		and pass_fail != 'W' \
		and cos_type != '必修'\
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
	where cn.unique_id = concat(sc.cos_year,'-',sc.semester,'-',sc.cos_id)"

findGrad_with_skip = "\
	select cn.unique_id, cn.cos_cname, sc.score \
	from \
	(\
		select cos_year, semester, cos_id, score \
		from cos_score \
		where student_id = '{id}' \
		and score_type != '通過不通過' \
		and pass_fail != 'W' \
		and cos_type != '必修'\
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
		and (sc.cos_year != {year} or sc.semester != {semester})"

findGradSpecify = "\
	select cn.unique_id, cn.cos_cname, sc.score \
	from \
	(\
		select cos_year, semester, cos_id, score \
		from cos_score \
		where student_id = '{id}' \
		and score_type != '通過不通過' \
		and pass_fail != 'W' \
		and cos_type != '必修'\
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
		and sc.cos_year = {year} and sc.semester = '{semester}';"