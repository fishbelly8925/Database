exports.SetEnCertificate='\
    update student set en_certificate = :check\
    where student_id = :id';

exports.SetStudentGraduateStatus='\
    update student set graduate = :graduate\
    where student_id = :id';

exports.SetGraduateSubmitStatus='\
    update student set graduate_submit = :graduate_submit\
    where student_id = :id';
