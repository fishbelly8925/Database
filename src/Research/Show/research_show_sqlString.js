exports.ShowTeacherResearchStudent="\
    select r.teacher_id,r.intro, s.sname, r.student_id, r.class_detail, r.research_title, r.first_second, r.score, r.semester, r.comment\
    from \
    (\
        select r.intro, t.teacher_id, r.student_id, r.class_detail, r.score, r.research_title, r.first_second, r.semester, r.comment\
        from research_student as r, teacher as t\
        where r.tname = t.tname\
    ) as r, student as s \
    where s.student_id = r.student_id \
    and r.teacher_id = :teacher_id \
    order by substring(s.student_id, 1, 2) desc";

exports.ShowTeacherInfoResearchCnt="\
    select *\
    from\
    (\
        select r.teacher_id, r.tname, substring(r.student_id, 1, 2) as 'grade', count(*) as 'scount'\
        from \
        (\
            select distinct r.student_id, r.tname, t.teacher_id \
            from research_student as r, teacher as t\
            where r.tname = t.tname\
        ) as r \
        where r.student_id IN \
        (\
            select student_id \
            from student \
        )\
        group by substring(r.student_id, 1, 2), r.tname \
        order by r.tname, substring(r.student_id, 1, 2)\
    ) as o, \
    (\
        select phone, tname, email, expertise, info\
        from teacher_info\
    ) as t\
    where o.tname = t.tname";

exports.ShowGivenGradeStudentResearch="\
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

exports.ShowStudentResearchInfo="\
    select *\
    from research_student\
    where student_id = :student_id";

exports.ShowResearchGroup="\
    select student_id \
    from research_student\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester";

exports.ShowResearchFilePath="\
    select * from research_file where \
    research_title = :research_title \
    and tname = :tname \
    and first_second = :first_second;"

exports.ShowResearchScoreComment="\
    select r.tname, r.student_id, r.score, s.sname, r.comment\
    from research_student as r, \
    (\
        select student_id, sname \
        from student \
    ) as s\
    where s.student_id = r.student_id\
    and r.semester = :semester\
    and r.first_second = :first_second"

exports.ShowTeacherResearchApplyFormList="\
    select a.student_id, s.sname, s.program,a.research_title, a.teacher_id, a.tname, a.first_second, a.agree, s.phone, s.email, a.semester\
    from \
    (\
        select t.teacher_id, r.student_id, r.research_title, r.tname, r.agree, r.first_second, r.semester\
        from teacher as t, research_apply_form as r\
        where t.tname = r.tname\
    ) as a, \
    (\
        select sname, student_id, phone, email, program \
        from student\
    ) as s\
    where s.student_id = a.student_id \
    and a.teacher_id = :teacher_id \
    order by a.research_title";

exports.ShowStudentResearchApplyForm="\
    select a.student_id, s.sname, a.research_title, a.tname, a.agree, a.first_second, s.phone, s.email, a.semester\
    from research_apply_form as a, \
    (\
        select sname, student_id, phone, email\
        from student\
        where student_id = :student_id\
    ) as s\
    where s.student_id = a.student_id\
    and first_second = :first_second";
