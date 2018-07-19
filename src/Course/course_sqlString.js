exports.ShowCosScoreDetail = "\
    select \
    cos_code, avg(score) as avg,\
    avg(case when score>=60 then score end) as Pavg, count(*) as member,\
    count(case when score>=60 then 1 end) as passed, max(score) as max\
    from cos_score \
    where cos_code = :cos_code\
    and concat(cos_year, '-' , semester, '-', cos_id) = :unique_id";

exports.ShowCosScoreInterval = "\
    select\
    count(case when score is NULL then 1 end) as 'null',\
    count(case when score<10 then score end) as '<10',\
    count(case when score<20 and score>=10 then score end) as '10-19',\
    count(case when score<30 and score>=20 then score end) as '20-29',\
    count(case when score<40 and score>=30 then score end) as '30-39',\
    count(case when score<50 and score>=40 then score end) as '40-49',\
    count(case when score<60 and score>=50 then score end) as '50-59',\
    count(case when score<70 and score>=60 then score end) as '60-69',\
    count(case when score<80 and score>=70 then score end) as '70-79',\
    count(case when score<90 and score>=80 then score end) as '80-89',\
    count(case when score<100 and score>=90 then score end) as '90-100'\
    from cos_score\
    where concat(cos_year, '-' , semester, '-', cos_id) = :unique_id";

exports.ShowCosMotionLocate = "\
    select cos_cname, orig_pos, now_pos\
    from cos_motion\
    where student_id = :id";

exports.ShowCosMapRule = "\
    select\
        a.cos_cname, a.grade, a.semester,\
        b.pre_cos_cname as suggest, c.pre_cos_cname as pre \
    from\
    (\
        select c.cos_cname, c.grade, c.semester\
        from cos_require as c, student as s\
        where s.student_id = :id\
        and c.school_year = :year\
        and s.program like concat(c.program, '%') \
        order by grade, semester\
    ) as a \
    left outer join \
    (\
        select pre_cos_cname, after_cos_cname\
        from cos_suggest as c, student as s\
        where s.student_id=:id\
        and s.program like concat(c.program, '%')\
        and c.school_year = :year\
    ) as b\
    on a.cos_cname = b.after_cos_cname\
    left outer join\
    (\
        select pre_cos_cname, after_cos_cname \
        from cos_pre as c, student as s \
        where s.student_id = :id\
        and s.program like concat(c.program, '%')\
        and c.school_year = :year\
    ) as c\
    on a.cos_cname = c.after_cos_cname\
    order by a.grade, a.semester, a.cos_cname";

exports.ShowCosMapPass = "\
    select distinct c.cos_cname\
    from\
    (\
        select cos_code,\
            concat(cos_year, '-', semester, '-', cos_id) as unique_id\
        from cos_score\
        where student_id = :id\
        and pass_fail = '通過'\
    ) as cs\
    left outer join\
    cos_name as c\
    on cs.unique_id = c.unique_id\
    where c.cos_code like 'DCP%'\
    or c.cos_code like 'IOE%'\
    or cos_cname like '微積分甲%'\
    or cos_cname like '物理%'\
    or cos_cname like '化學%'\
    or cos_cname like '生物%'\
    or cos_cname like '微積分Ｂ%'\
    or cos_cname like '微積分Ａ%'";

exports.ShowCosMapIntro ="\
    select\
        tcr.tname, a.cos_cname , a.cos_code, a.num_limit,\
        a.reg_num, a.cos_typeext as english, a.unique_id\
    from teacher_cos_relation as tcr\
    JOIN\
    (\
        select\
            d.teacher_id, n.cos_code, d.num_limit,\
            d.reg_num, d.cos_typeext, d.unique_id, n.cos_cname\
        from cos_name as n, cos_data as d\
        where n.unique_id = d.unique_id\
        AND n.cos_cname LIKE CONCAT('%', :cos_cname , '%')\
        AND d.cos_code LIKE 'DCP%'\
    ) AS a\
    ON a.teacher_id LIKE CONCAT('%', tcr.teacher_id, '%')\
    order by a.unique_id DESC";

exports.SetCosMotion = "\
    insert into cos_motion (student_id, cos_cname, orig_pos, now_pos)\
    values (:id, :name, :orig, :now)\
    on duplicate key update now_pos = :now";

exports.DeleteCosMotion = "\
    delete from cos_motion\
    where student_id = :id";