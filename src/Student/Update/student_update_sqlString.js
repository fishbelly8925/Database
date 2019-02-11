exports.SetUserEmail = "\
    update student\
    set email = :email \
    where student_id = :id";

exports.setGmail = "\
    update student\
    set gmail = :gmail\
    where student_id = :id";

exports.setFbId = "\
    update student\
    set fb_id = :fb_id\
    where student_id = :id";

exports.setGithubId = "\
    update student\
    set github_id = :github_id\
    where student_id = :id";

exports.SetUserPhone = "\
    update student set phone = :phone\
    where student_id = :student_id";

exports.CreateOffsetApplyForm = "\
    insert into offset_apply_form\
    select :student_id, :apply_year, :apply_semester, :cos_dep_old,\
        :cos_tname_old, :cos_cname_old, :cos_code_old, :cos_cname,\
        :cos_code, :cos_type, MIN(c.cos_credit), :reason, 0, :credit_old,\
        :file, NOW(), :school_old, :dep_old, :graduation_credit_old, \
        :cos_year_old, :cos_semester_old, :score_old, :offset_type, :transferto\
    from cos_data as c,cos_name as n\
    where c.cos_code=:cos_code\
    and c.cos_code=n.cos_code\
    and n.cos_cname=:cos_cname";

exports.DeleteOffsetApplyForm = "\
    delete from offset_apply_form\
    where student_id = :student_id\
    and cos_cname_old = :cos_cname_old\
    and cos_code_old = :cos_code_old";

exports.CreateOffset = "\
    insert into offset\
    values(:student_id, :apply_year, :apply_semester, :cos_code_old,\
        :cos_cname_old, :cos_code, :cos_cname, :credit, '免修',\
        NULL, :cos_type)";

exports.SetOffsetApplyFormAgreeStatus = "\
    update offset_apply_form\
    set agree = :state, transferto = :transferto\
    where student_id = :student_id\
    and cos_cname_old = :cos_cname_old\
    and cos_code_old = :cos_code_old";

exports.SetRecommendCosStar = "\
    insert into rs_feedback\
    (student_id, unique_id, star_level)\
    values\
    (:student_id, :unique_id, :star_level)";

exports.CheckRecommendCosStar = "\
    select * \
    from rs_feedback\
    where student_id = :student_id\
    and unique_id = :unique_id";

exports.UpdataRecommendCosStar = "\
    update rs_feedback \
    set star_level = :star_level \
    where student_id = :student_id \
    and unique_id = :unique_id";


