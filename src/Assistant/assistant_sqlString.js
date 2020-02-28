exports.SetEnCertificate = '\
    update student set en_certificate = :check\
    where student_id = :id';

exports.SetGraduateSubmitStatus = '\
    update student \
    set graduate_submit = \
            if(:graduate_submit != 4, :graduate_submit, \
                (\
                    select a.graduate_submit \
                    from (\
                        select student_id, graduate_submit \
                        from student \
                        where student_id = :id\
                    ) as a \
                )\
			)\
    where student_id = :id';

exports.SetSubmitTypeStatus = '\
    update student \
    set submit_type = \
		if(:submit_type = 3, null, :submit_type) \
    where student_id = :id';
exports.SetNetMediaStatus = '\
	update student\
	set net_media = :net_media\
    where student_id = :id';
exports.SetRejectReason = '\
    update student\
    set reject_reason = :reject_reason\
    where student_id = :id';
exports.CreateApplyPeriod = '\
    insert into apply_period \
    values (:semester,:type,:begin,:end)';
exports.SetApplyPeriod = '\
    update apply_period \
    set begin = :begin, end = :end \
    where semester = :semester and type = :type';
exports.ShowApplyPeriod = '\
    select type, begin, end \
    from apply_period \
    where semester = :semester';

exports.ShowAllDataLog = '\
    select * from log_file;'