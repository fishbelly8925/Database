exports.ShowStudentGraduate = "\
	select *\
	from \
	(\
		select *\
		from graduate\
		where student_id = :student_id\
	) as g,\
	(\
		select sname, program, graduate_submit as graduate_status, submit_type as submit_status, en_certificate as en_status\
		from student\
		where student_id = :student_id\
	) as s";

exports.ShowStudentCompulse = "\
    select * \
    from compulse \
    where student_id = :student_id";

exports.DeleteStudentGraduate = "\
	delete from graduate\
	where student_id = :student_id";

exports.DeleteStudentCompulse = "\
	delete from compulse\
	where student_id = :student_id";

exports.CreateStudentGraduate = "\
	insert into graduate \
	values (\
		:student_id, :total_credit, :en_course, :pro, :other, :net, :media,\
		:old_total, :old_contemp, :old_culture, :old_history,\
		:old_citizen, :old_group, :old_science,\
		:new_total, :new_core_total, :new_core_society, :new_core_humanity, :new_basic, :new_cross,\
		:en_total, :en_basic, :en_advanced, :en_advanced_course, :pe, :service, :art, :mentor\
	)";

exports.CreateStudentCompulse = "\
	insert into compulse \
	values (\
		:student_id, :cos_cname\
	)";

exports.ClearStudentCompulse = "\
	delete from compulse\
	where student_id = :student_id";

exports.SetStudentGraduate = "\
	update graduate\
	set total_credit = :total_credit,\
	en_course = :en_course, \
	pro = :pro, \
	other = :other, \
	net = :net, \
	media = :media,\
	old_total = :old_total, \
	old_contemp = :old_contemp, \
	old_culture = :old_culture, \
	old_history = :old_history, \
	old_citizen = :old_citizen, \
	old_group = :old_group, \
	old_science = :old_science,\
	new_total = :new_total, \
	new_core_total = :new_core_total, \
	new_core_society = :new_core_society, \
	new_core_humanity = :new_core_humanity, \
	new_basic = :new_basic, \
	new_cross = :new_cross, \
	en_total = :en_total, \
	en_basic = :en_basic, \
	en_advanced = :en_advanced, \
	en_advanced_course = :en_advanced_course, \
	pe = :pe, \
	service = :service, \
	art = :art, \
	mentor = :mentor \
	where student_id = :student_id";

exports.ShowGivenGradeStudentID = "\
	select student_id\
	from student\
	where grade = :grade\
	and (\
		substring(program, 1, 2) = '資工'\
		or substring(program, 1, 2) = '網多'\
		or substring(program, 1, 2) = '資電'\
	)";