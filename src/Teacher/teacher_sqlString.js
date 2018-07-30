exports.ShowTeacherCosNow = "\
    select *\
    from cos_name as n\
    where n.cos_code IN\
    (\
        select c.cos_code\
        from cos_data as c\
        where c.unique_id LIKE '107-1%'\
        and c.teacher_id IN\
        (\
            select tc.teacher_id\
            from teacher_cos_relation as tc\
            where tc.tname IN\
            (\
                select t.tname\
                from teacher as t\
                where t.teacher_id = :id\
            )\
        )\
        order by cos_code\
    )";

exports.ShowTeacherCosAll = "\
    select *\
    from cos_name as n\
    where n.cos_code IN\
    (\
        select c.cos_code\
        from cos_data as c\
        where c.teacher_id IN\
        (\
            select tc.teacher_id\
            from teacher_cos_relation as tc\
            where tc.tname IN\
            (\
                select t.tname\
                from teacher as t\
                where t.teacher_id = :id\
            )\
        )\
        order by cos_code\
    )";

exports.ShowTeacherMentors ="\
    select s.student_id, s.sname, s.program \
    from student as s, mentor_list as m, teacher as t \
    where t.teacher_id = :id \
    and t.tname = m.tname \
    and m.student_id = s.student_id";

exports.ShowTeacherIdList="\
    select t.teacher_id, t.tname, ti.email, count(*) as all_student\
    from teacher as t, teacher_info as ti,mentor_list as m, student as s\
    where t.tname = ti.tname\
    and t.tname = m.tname\
    group by t.tname";