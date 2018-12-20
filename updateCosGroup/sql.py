Find_Cos = "\
	select distinct cn.cos_cname, cd.cos_code\
	from cos_name as cn, cos_data as cd\
	where cn.unique_id = cd.unique_id\
	and (cd.cos_code like 'DCP%' \
		or cd.cos_code like 'IOC%' \
		or cd.cos_code like 'IOE%' \
		or cd.cos_code like 'ILE%' \
		or cd.cos_code like 'IDS%' \
		or cd.cos_code like 'CCS%' \
		or cd.cos_code like 'ICP%'\
		or cn.cos_cname like '物理%'\
		or cn.cos_cname like '化學%'\
		or cn.cos_cname like '普通生物%'\
		or cn.cos_cname like '微積分%')\
	order by cn.cos_cname"