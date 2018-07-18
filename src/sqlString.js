exports.a_uploadGrade = "\
    load data local infile\
    :pt\
    into table cos_score\
    fields terminated by \', \'\
    enclosed by \'\"\'\
    lines terminated by \'\n\'\
    ignore 1 lines;";

exports.setStudentGraduate='\
    update student set graduate=:graduate where student_id=:id';

exports.setStudentGraduateSubmit='\
    update student set graduate_submit=:graduate_submit where student_id=:id';

exports.setEnCertificate='\
    update student set en_certificate=:check where student_id=:id';

exports.qaSearch='\
    select * from qa_record';
exports.qaInsert='\
    insert into qa_record (id, que, ans)\
    values (:id, :que, :ans)';
exports.qaMaxId='\
    select max(id) as maxID from qa_record'
exports.qaDelete='\
    delete from qa_record where id=:id';

exports.findCurrentCos = "\
    select distinct cd.unique_id, cn.cos_cname, cd.teacher_id, cd.cos_time, cd.cos_code \
    from \
    (\
        select unique_id, teacher_id, cos_time, cos_code \
        from cos_data \
        where unique_id like :semester \
        and \
        (\
            cos_code like 'DCP%' \
            or cos_code like 'IOC%' \
            or cos_code like 'IOE%' \
            or cos_code like 'ILE%' \
            or cos_code like 'IDS%' \
            or cos_code like 'CCS%' \
            or cos_code like 'ICP%' \
        )\
    ) as cd, \
    (\
        select unique_id, cos_cname\
        from cos_name\
        where unique_id like :semester\
    ) as cn\
    where cd.unique_id=cn.unique_id";

exports.findTeacherResearchCountAndInfo="\
    select *\
    from\
    (\
        select r.teacher_id, r.tname, substring(r.student_id, 1, 2) as 'grade', count(*) as 'scount'\
        from \
        (\
            select distinct r.student_id, r.tname, t.teacher_id \
            from research_student as r, teacher as t\
            where r.tname=t.tname\
        ) as r \
        where r.student_id in ( select student_id from student ) \
        group by substring(r.student_id, 1, 2), r.tname \
        order by r.tname, substring(r.student_id, 1, 2)\
    ) as o, \
    (\
        select phone, tname, email, expertise, info\
        from teacher_info\
    ) as t\
    where o.tname=t.tname;"

exports.findTeacherResearch="\
    select s.sname, r.student_id, r.class_detail, r.research_title, r.first_second, r.score, r.semester, r.comment\
    from \
    (\
        select t.teacher_id, r.student_id, r.class_detail, r.score, r.research_title, r.first_second, r.semester, r.comment\
        from research_student as r, teacher as t\
        where r.tname=t.tname\
    ) as r, student as s \
    where s.student_id = r.student_id \
    and r.teacher_id = :teacher_id \
    order by substring(s.student_id, 1, 2) desc";

exports.mailCreateSender="\
    insert into mail(mail_id, title, sender_id, receiver_id, content) \
    values(concat(:sender_id, \'-\', CURRENT_TIMESTAMP, \'-\', :receiver_id), \
    :title, :sender_id, :receiver_id, :content);";

exports.mailCreateReceiver="\
    insert into mail(mail_id, title, sender_id, receiver_id, content) \
    values(concat(:receiver_id, \'-\', CURRENT_TIMESTAMP, \'-\', :sender_id), \
    :title, :sender_id, :receiver_id, :content);";

exports.mailDelete="\
    delete from mail \
    where mail_id=:mail_id;"

exports.mailReadSet="\
    update mail set read_bit=:read_bit where mail_id=:mail_id";

exports.mailReturnSingle="\
    select * from mail where mail_id=:mail_id";

exports.mailReturnReceiveList="\
    select m.mail_id, m.title, m.sender_id, m.receiver_id, m.read_bit, m.send_time, m.sender, id.name as receiver\
    from\
    (\
        select m.mail_id, m.title, m.sender_id, m.receiver_id, m.read_bit, m.send_time, id.name as sender\
        from\
        (\
            select mail_id, title, sender_id, receiver_id, read_bit, send_time from mail where receiver_id=:receiver_id and mail_id like concat(:receiver_id, \'%\')\
        ) as m, \
        (\
            select student_id as id, sname as name from student\
            union\
            select teacher_id as id, tname as name from teacher\
        ) as id\
        where m.sender_id=id.id\
    ) as m, \
    (\
        select student_id as id, sname as name from student\
        union\
        select teacher_id as id, tname as name from teacher\
    ) as id\
    where m.receiver_id=id.id\
    order by m.send_time desc;";

exports.mailReturnSendList="\
    select m.mail_id, m.title, m.sender_id, m.receiver_id, m.read_bit, m.send_time, m.sender, id.name as receiver\
    from\
    (\
        select m.mail_id, m.title, m.sender_id, m.receiver_id, m.read_bit, m.send_time, id.name as sender\
        from\
        (\
            select mail_id, title, sender_id, receiver_id, read_bit, send_time from mail where sender_id=:sender_id and mail_id like concat(:sender_id, \'%\')\
        ) as m, \
        (\
            select student_id as id, sname as name from student\
            union\
            select teacher_id as id, tname as name from teacher\
        ) as id\
        where m.sender_id=id.id\
    ) as m, \
    (\
        select student_id as id, sname as name from student\
        union\
        select teacher_id as id, tname as name from teacher\
    ) as id\
    where m.receiver_id=id.id\
    order by m.send_time desc;";

exports.addPhone="\
    update student set phone=:phone\
    where student_id=:student_id;"

exports.researchApplyFormCreate="\
    insert into research_apply_form\
    values(:student_id, :research_title, :tname, 0, :first_second, :semester);"

exports.researchApplyFormSetAgree="\
    update research_apply_form set agree=:agree \
    where research_title=:research_title and tname=:tname \
    and first_second=:first_second and semester=:semester;"

exports.researchApplyFormDelete="\
    delete from research_apply_form \
    where research_title=:research_title and \
    tname=:tname and first_second=:first_second \
    and semester=:semester;"

exports.researchApplyFormTeaReturn="\
    select a.student_id, s.sname, a.research_title, a.tname, a.first_second, a.agree, s.phone, s.email, a.semester\
    from \
    (\
        select t.teacher_id, r.student_id, r.research_title, r.tname, r.agree, r.first_second, r.semester\
        from teacher as t, research_apply_form as r\
        where t.tname=r.tname\
    ) as a, \
    (\
        select sname, student_id, phone, email from student\
    ) as s\
    where s.student_id=a.student_id and a.teacher_id=:teacher_id\
    order by a.research_title;";

exports.researchApplyFormPersonalReturn="\
    select a.student_id, s.sname, a.research_title, a.tname, a.agree, a.first_second, s.phone, s.email, a.semester\
    from research_apply_form as a, \
    (\
        select sname, student_id, phone, email\
        from student\
        where student_id=:student_id\
    ) as s\
    where s.student_id=a.student_id;";

exports.showGivenGradeStudentResearch="\
    select distinct s1.student_id, s1.sname as name, s1.program, t.teacher_id, s1.tname\
    from teacher as t\
    right outer join\
    (\
        select s.student_id, s.sname, s.program, s.grade, rs.tname\
        from student as s, \
        (\
            select student_id, tname\
            from research_student\
            where student_id LIKE concat(:grade, '%')\
        ) as rs\
        where s.student_id = rs.student_id\
    ) as s1\
    on t.tname = s1.tname";

exports.showResearchPage="\
    select *\
    from research_student\
    where student_id = :student_id";

exports.findResearchGroup="\
    select student_id \
    from research_student\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester";

exports.setResearchTitle="\
    update research_student set research_title = :new_title\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester";

exports.setResearchLink="\
    update research_student set link = :new_link\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester";

exports.setResearchIntro="\
    update research_student set intro = :new_intro\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester";

exports.setResearchScore="\
    update research_student set score = :new_score\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and student_id = :student_id\
    and semester = :semester";

exports.createNewResearch="\
    insert into research_student\
    (student_id, tname, research_title, first_second, semester)\
    values\
    (:student_id, :tname, :research_title, :first_second, :semester)";
    
exports.researchFileCreate="\
    insert into research_file \
    values(:research_title, :tname, :file_name, :first_second, :file_path, :file_type);"

exports.researchFileReturn="\
    select * from research_file where \
    research_title=:research_title \
    and tname=:tname \
    and first_second=:first_second;"

exports.showResearchInfo="\
    select intro\
    from research_student\
    where research_title=:research_title\
    and tname=:tname\
    and first_second = :first_second\
    and semester=:semester;"

exports.updateResearchTitle="\
    update research_student set research_title = :new_title\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester"

exports.showResearchGradeComment="\
    select r.tname, r.student_id, r.score, s.sname, r.comment\
    from research_student as r, \
    (\
        select student_id, sname from student\
    ) as s\
    where s.student_id=r.student_id\
    and r.semester = :semester\
    and r.first_second = :first_second"

exports.setResearchComment="\
    update research_student set comment = :new_comment\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and student_id = :student_id\
    and semester = :semester"

