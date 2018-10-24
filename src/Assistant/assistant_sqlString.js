exports.SetEnCertificate='\
    update student set en_certificate = :check\
    where student_id = :id';

exports.SetStudentGraduateStatus='\
    update student set graduate = :graduate\
    where student_id = :id';

exports.SetGraduateSubmitStatus='\
    update student set graduate_submit = :graduate_submit, \
    submit_type = if(:submit_type = 1,1,if(:submit_type = 0,0,if(:submit_type = 3,null,(select a.submit_type from (select student_id,submit_type from student where student_id = :id) \
    as a) ))) where student_id = :id';

