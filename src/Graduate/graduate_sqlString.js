exports.ShowStudentGraduate = "\
	select *\
	from \
	(\
		select *\
		from graduate\
		where student_id = :student_id\
	) as g,\
	(\
		select sname, program, graduate_submit as submit_status, submit_type, en_certificate as en_status, net_media, reject_reason\
		from student\
		where student_id = :student_id\
	) as s";

exports.ShowStudentCompulse = "\
    select * \
    from compulse \
    where student_id = :student_id";

exports.ShowStudentCurrentCos = "\
    select * \
    from graduate_current_cos \
    where student_id = :student_id";

exports.DeleteStudentGraduate = "\
	delete from graduate\
	where student_id = :student_id";

exports.DeleteStudentCompulse = "\
	delete from compulse\
	where student_id = :student_id";

exports.DeleteStudentCurrentCos = "\
	delete from graduate_current_cos\
	where student_id = :student_id";

exports.CreateStudentGraduate = "\
	insert into graduate \
	values (\
		:student_id, :graduate_status, :total_credit, :en_course, :pro, :other, :net, :media,\
		:old_total, :old_contemp, :old_culture, :old_history,\
		:old_citizen, :old_group, :old_science,\
		:new_total, :new_core_total, :new_core_society, :new_core_humanity, :new_basic, :new_cross,\
		:en_total, :en_basic, :en_advanced, :en_uncertified, :pe, :service, :art, :mentor\
	)";

exports.CreateStudentCompulse = "\
	insert into compulse \
	values (\
		:student_id, :cos_cname\
	)";

exports.CreateStudentCurrentCos = "\
	insert into graduate_current_cos \
	values (\
		:student_id, :current_cos_cname\
	)";

exports.SetStudentGraduate = "\
	update graduate\
	set total_credit = :total_credit,\
	graduate_status = :graduate_status, \
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
	en_uncertified = :en_uncertified, \
	pe = :pe, \
	service = :service, \
	art = :art, \
	mentor = :mentor \
	where student_id = :student_id";

exports.ShowGivenGradeStudentID = "\
	select student_id\
	from student\
	where grade = :grade\
	and study_status not like '%畢業%'\
	and study_status not like '%休學%'\
	and study_status not like '%退學%'\
	and (\
		substring(program, 1, 1) = 'A'\
		or substring(program, 1, 1) = 'B'\
		or substring(program, 1, 1) = 'C'\
		or substring(program, 1, 1) = 'D'\
	)";