exports.findStudent = "\
    select\
        s.student_id, s.sname, s.program, s.grade,\
        s.email, s.graduate, s.graduate_submit, s.gmail,\
        s.fb_id, s.github_id,\
        if(e.pass_code=0,s.en_certificate,e.pass_code) as en_certificate\
    from student as s, en_certificate as e\
    where s.student_id = :id\
    and e.student_id = :id\
    union\
    select\
        s.student_id, s.sname, s.program, s.grade,\
        s.email, s.graduate, s.graduate_submit, s.gmail,\
        s.fb_id, s.github_id, NULL as en_certificate\
    from student as s\
    where s.student_id = :id\
    and s.student_id not in\
    (\
        select student_id\
        from en_certificate\
    )";

exports.findCrossStudent = "\
    select *\
    from student\
    where student_id = :id\
    and program != '資工A'\
    and program != '資工B'\
    and program != '資電'\
    and program != '網多'";

exports.findProfessor = "\
    select teacher_id, tname\
    from teacher\
    where teacher_id = :id";

exports.findTeacher = "\
    select teacher_id, tname\
    from teacher_cos_relation";

exports.findAssistant = "\
    select assistant_id, aname from assistant\
    where assistant_id=:id";

exports.ShowUserAllScore = "\
    select DISTINCT\
        if(ISNULL(c.cos_code), a.cos_code, c.cos_code) as cos_code,\
        if(ISNULL(c.cos_cname), a.cos_cname, c.cos_cname) as cos_cname,\
        c.cos_code_old, cos_cname_old, a.cos_ename, a.pass_fail, a.cos_type,\
        if(a.score_type='通過不通過', NULL, a.score) as score,\
        if(a.score_type='通過不通過', NULL, a.score_level) as score_level,\
        if((a.cos_typeext=''&&a.brief like '體育%'), '體育', a.cos_typeext) as cos_typeext,\
        b.type, a.brief, a.brief_new, a.cos_credit, a.year,\
        a.semester, c.offset_type, tcr.tname\
    from\
    (\
        select DISTINCT\
            d.teacher_id, s.score_type, s.pass_fail, s.score,\
            s.score_level, d.cos_code, n.cos_cname, n.cos_ename,\
            s.cos_type, d.cos_typeext, d.brief, d.brief_new,\
            d.cos_credit, s.year, s.semester\
        from cos_data as d,\
        (\
            select\
                score_type, cos_type, cos_year as year,semester,\
                cos_id as code, cos_code, pass_fail, score, score_level,\
                concat(cos_year, '-', semester, '-', cos_id) as unique_id\
            from cos_score\
            where student_id = :id\
        ) as s,\
        cos_name as n\
        where\
        d.unique_id = concat(s.year, '-', s.semester, '-', s.code)\
        and d.cos_code = n.cos_code\
        and n.unique_id = d.unique_id\
    ) as a left outer join\
    (\
        select DISTINCT\
            s.score_type, s.pass_fail, s.score, s.score_level,\
            d.cos_code, n.cos_cname, s.cos_type, d.cos_typeext,\
            t.type, d.brief, d.brief_new, d.cos_credit, s.year,\
            s.semester\
        from cos_data as d,\
        (\
            select \
                score_type, cos_type, cos_year as year, semester,\
                cos_id as code, cos_code, pass_fail, score, score_level,\
                concat(cos_year, '-', semester, '-', cos_id) as unique_id\
            from cos_score\
            where student_id = :id\
        ) as s,\
        cos_name as n, cos_type as t, student as sd\
        where sd.student_id = :id\
        and d.unique_id = concat(s.year, '-', s.semester, '-', s.code)\
        and n.unique_id = d.unique_id\
        and n.cos_cname like concat(t.cos_cname, '%')\
        and t.school_year = :year\
        and sd.program like concat(t.program, '%')\
    ) as b\
    on b.cos_code = a.cos_code\
    and b.cos_cname = a.cos_cname\
    and b.year = a.year\
    and b.semester = a.semester\
    left outer join\
    (\
        select\
            offset_type, cos_code_old, cos_cname_old, cos_code,cos_cname\
        from offset\
        where student_id = :id\
    ) as c\
    on a.cos_code = c.cos_code_old\
    and a.cos_cname = c.cos_cname_old\
    left outer join teacher_cos_relation as tcr\
    on a.teacher_id = tcr.teacher_id\
    order by a.year, a.semester asc";

exports.ShowUserPartScore = "\
    select DISTINCT\
        if(ISNULL(c.cos_code), a.cos_code, c.cos_code) as cos_code,\
        if(ISNULL(c.cos_cname), a.cos_cname, c.cos_cname) as cos_cname,\
        c.cos_code_old, cos_cname_old, a.cos_ename, a.pass_fail,a.cos_type,\
        if(a.score_type='通過不通過', NULL, a.score) as score,\
        if(a.score_type='通過不通過', NULL, a.score_level) as score_level,\
        if((a.cos_typeext=''&&a.brief like '體育%'), '體育', a.cos_typeext) as cos_typeext,\
        b.type, a.brief, a.brief_new, a.cos_credit, a.year,\
        a.semester, c.offset_type\
    from\
    (\
        select DISTINCT\
            s.score_type, s.pass_fail, s.score, s.score_level,\
            d.cos_code, n.cos_cname, n.cos_ename, d.cos_type,\
            d.cos_typeext, d.brief, d.brief_new, d.cos_credit,\
            s.year, s.semester\
        from cos_data as d,\
        (\
            select\
                score_type, cos_year as year, semester, cos_id as code,\
                cos_code, pass_fail, score, score_level,\
                concat(cos_year, '-', semester, '-', cos_id) as unique_id\
            from cos_score\
            where student_id = :id\
        ) as s,\
        cos_name as n\
        where\
        d.unique_id = concat(s.year, \'-\', s.semester, \'-\', s.code)\
        and d.cos_code = n.cos_code\
        and n.unique_id = d.unique_id\
    ) as a\
    left outer join\
    (\
        select DISTINCT\
            s.score_type, s.pass_fail, s.score, s.score_level,\
            d.cos_code, n.cos_cname, d.cos_type, d.cos_typeext,\
            t.type, d.brief, d.brief_new, d.cos_credit, s.year,\
            s.semester\
        from cos_data as d,\
        (\
            select\
                score_type, cos_year as year, semester, cos_id as code,\
                cos_code, pass_fail, score, score_level,\
                concat(cos_year, '-', semester, '-', cos_id) as unique_id\
            from cos_score\
            where student_id = :id\
        ) as s,\
        cos_name as n, cos_type as t, student as sd\
        where sd.student_id = :id\
        and d.unique_id = concat(s.year, '-', s.semester, '-', s.code)\
        and n.unique_id = d.unique_id\
        and n.cos_cname like concat(t.cos_cname, '%')\
        and t.school_year = :year\
        and sd.program like concat(t.program, '%')\
    ) as b\
    on b.cos_code = a.cos_code\
    and b.cos_cname = a.cos_cname\
    and b.year = a.year\
    and b.semester = a.semester\
    left outer join\
    (\
        select\
            offset_type, cos_code_old, cos_cname_old, cos_code, cos_cname\
        from offset\
        where student_id = :id\
    ) as c\
    on a.cos_code = c.cos_code_old\
    and a.cos_cname = c.cos_cname_old\
    where a.pass_fail = '通過' and a.cos_type = :category\
    order by a.year, a.semester asc";

// exports.general_cos_rule = "\
//     select cos_code, cos_cname, brief, brief_new\
//     from general_cos_rule";

exports.ShowRecommendCos = "\
    select cos_name_list\
    from rs\
    where student_id = :id";

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

exports.ShowStudentIdList = "\
    select student_id, sname\
    from student";

exports.ShowStudentMentor = "\
    select tname\
    from mentor_list\
    where student_id = :id";

exports.ShowUserOnCos = "\
    select\
        s.student_id, cd.cos_code, cn.cos_cname, cn.cos_ename,\
        cd.cos_type, cd.cos_typeext, cd.brief, cd.brief_new,\
        cd.cos_credit\
    from on_cos_data as o\
    left outer join\
    student as s\
    on o.student_id = s.student_id\
    left outer join\
    cos_data as cd\
    on cd.unique_id = concat(o.year, '-', o.semester, '-', o.code)\
    left outer join\
    cos_name as cn\
    on cn.unique_id = cd.unique_id\
    where s.student_id = :id";

exports.ShowUserOffsetSingle = "\
    select\
        os.student_id, os.apply_year, os.apply_semester, os.cos_code_old,\
        os.cos_cname_old, os.cos_code, os.cos_cname, os.credit,\
        os.offset_type, os.brief, os.cos_type, cg.score\
    from offset as os\
    left outer join\
    (\
        select student_id, cos_cname, cos_code, score\
        from cos_score\
        where student_id = :id and pass_fail = '通過'\
    ) as cg\
    on cg.student_id = os.student_id\
    and cg.cos_code = os.cos_code_old\
    and cg.cos_cname = os.cos_cname_old\
    where os.student_id = :id";

exports.ShowUserOffsetAll="\
    select\
        os.student_id, os.apply_year, os.apply_semester, os.cos_code_old,\
        os.cos_cname_old, os.cos_code, os.cos_cname, os.credit,\
        os.offset_type, os.brief, os.cos_type, cg.score\
    from offset as os\
    left outer join\
    (\
        select student_id, cos_cname, cos_code, score\
        from cos_score\
        where student_id = :id and pass_fail = '通過'\
    ) as cg\
    on cg.student_id = os.student_id\
    and cg.cos_code = os.cos_code_old\
    and cg.cos_cname = os.cos_cname_old";

exports.ShowGraduateStudentListAll = "\
    select\
        student_id, sname, program, graduate_submit,\
        graduate, email, en_certificate\
    from student";

exports.ShowGraduateStudentListSingle = "\
    select\
        student_id, sname, program, graduate_submit,\
        graduate, email, en_certificate\
    from student\
    where student_id like concat(:sem, '%')";

exports.ShowGraduateRule = "\
    select\
        r.require_credit, r.pro_credit, r.free_credit,\
        r.core_credit, r.sub_core_credit, r.foreign_credit\
    from graduate_rule as r, student as s\
    where s.student_id = :id\
    and s.program like concat(r.program, '%')\
    and r.school_year = :year";

exports.ShowUserTotalCredit = "\
    select sum(t.cos_credit) as total\
    from\
    (\
        select distinct d.cos_code, d.cos_credit\
        from\
        (\
            select cos_code\
            from cos_score\
            where student_id = :id\
            and pass_fail = '通過'\
        ) as s, cos_data as d\
        where s.cos_code = d.cos_code\
    ) as t";

exports.ShowCosGroup = "\
    select\
        p.cos_cname, p.cos_ename, p.cos_codes,\
        IFNULL(a.type, '必修') as type\
    from cos_group as p\
    left outer join\
    (\
        select t.cos_cname, t.type, t.school_year\
        from student as s, cos_type as t\
        where s.student_id = :id\
        and s.program like concat(t.program, '%')\
        and t.school_year = :year\
    ) as a\
    on p.cos_cname = a.cos_cname\
    and a.school_year = :year\
    where a.type is not null\
    or p.cos_cname in\
    (\
        select cos_cname\
        from cos_require as r, student as s\
        where s.student_id = :id\
        and r.school_year = :year\
        and s.program like concat(r.program, '%')\
        union\
        select '物化生三選一(一)'\
        union\
        select '物化生三選一(二)'\
        union\
        select '導師時間'\
    )";