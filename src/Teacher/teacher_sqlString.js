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
    select\
        f.teacher_id as id, f.tname as name, f.email as email, a.all_students, f.failed_students\
    from\
    (\
        select t.teacher_id, t.tname, ti.email, COUNT(final.failed) as failed_students\
        from teacher as t\
        left outer join\
        (\
            select DISTINCT\
                (if(failed, s_final.student_id, '')) as failed, s_final.tname\
            from\
            (\
                select\
                    m.tname, s.student_id, concat(s.cos_year, '-', s.semester) as sem,\
                    if(sum(if(s.pass_fail = '不通過', cd.cos_credit, 0)*2 )\
                    >= sum(if(1, cd.cos_credit, 0)), 1, 0) as failed\
                from\
                (\
                    select s.student_id, cs.pass_fail, cs.cos_year, cs.semester, cs.cos_id\
                    from student as s, cos_score as cs\
                    where s.student_id = cs.student_id\
                    and ( cs.pass_fail = '通過' or cs.pass_fail = '不通過')\
                )as s,\
                cos_data as cd, mentor_list as m\
                where cd.unique_id = concat(s.cos_year, '-', s.semester, '-', s.cos_id)\
                and m.student_id = s.student_id\
                group by s.student_id, concat(s.cos_year, '-', s.semester)\
            )as s_final\
            where failed != ''\
            group by s_final.student_id, s_final.sem\
        ) as final\
        on t.tname = final.tname\
        left outer join\
        teacher_info as ti\
        on t.tname = ti.tname\
        group by t.tname\
    ) as f\
    inner join\
    (\
        select\
            t.teacher_id, t.tname, ti.email, count(m.student_id) as all_students\
        from\
        (teacher as t\
        left outer join\
        teacher_info as ti\
        on t.tname = ti.tname)\
        left outer join\
        mentor_list as m\
        on t.tname = m.tname\
        group by t.tname\
    )as a\
    on f.tname = a.tname";