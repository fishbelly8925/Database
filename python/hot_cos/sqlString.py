FindAllCos="""
	select a.student_id, a.unique_id, a.grade, a.cos_cname, b.tname, a.study_status
	from 
	(
		select a.student_id, a.unique_id, a.cos_cname, b.program, b.grade, b.study_status
		from 
		(
			select student_id, concat(cos_year, '-', semester, '-', cos_id) as unique_id, cos_cname
			from cos_score
			where 
			(
				cos_code like 'DCP%'
				or cos_code like 'IOC%'
				or cos_code like 'IOE%'
				or cos_code like 'ILE%'
				or cos_code like 'IDS%'
				or cos_code like 'CCS%'
				or cos_code like 'ICP%'
			)
			and cos_type != '必修'
		) as a
		left outer join
		(
			select student_id, program, grade, study_status
			from student
		) as b
		on a.student_id=b.student_id
	) as a
	left outer join
	(
		select d.unique_id, d.cos_credit, d.cos_time, d.cos_type, d.depType, d.grade, tcr.tname
		from cos_data as d, teacher_cos_relation as tcr
		where d.teacher_id=tcr.teacher_id 
		and cos_type != '必修'
	) as b
	on a.unique_id=b.unique_id
	order by a.unique_id DESC
""";

FindCurrentCos="""
	select b.cos_cname, a.tname, a.cos_id
	from 
	(
		select d.unique_id, d.cos_id, tcr.tname
		from cos_data as d, teacher_cos_relation as tcr
		where d.unique_id like '107-2%'
		and d.teacher_id=tcr.teacher_id 
	) as a
	left outer join
	(
		select unique_id, cos_cname
		from cos_name
	) as b
	on a.unique_id=b.unique_id
"""

InsertCos="""
	insert into hot_cos
	(grade, unique_id, count, url) 
	values 
	(%(grade)s, %(unique_id)s, %(count)s, %(url)s)
"""

DeleteRecord="""
	delete from hot_cos
	where grade=%(grade)s
"""
