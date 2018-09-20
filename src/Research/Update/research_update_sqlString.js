exports.SetResearchAddStatus="\
    update research_student\
    set add_status = :add_status\
    where student_id = :student_id\
    and research_title = :research_title\
    and first_second = :first_second\
    and semester = :semester";

exports.setResearchTitle="\
    update research_student\
    set research_title = :new_title\
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

exports.setResearchComment="\
    update research_student set comment = :new_comment\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and student_id = :student_id\
    and semester = :semester";

exports.CreateNewResearch="\
    insert into research_student\
    (student_id, tname, research_title, first_second, semester)\
    values\
    (:student_id, :tname, :research_title, :first_second, :semester)";
    
exports.ChangeResearch="\
    insert into research_student\
    (student_id, tname, research_title, first_second, semester)\
    values\
    (:student_id, :tname, :research_title, :first_second, :semester)\
    on duplicate key update\
    tname = :tname, research_title = :research_title,\
    first_second = :first_second";

exports.DeleteResearch="\
    delete from research_student \
    where student_id = :student_id and first_second = :first_second and semester = :semester";


exports.SetResearchTitle="\
    update research_student set research_title = :new_title\
    where research_title = :research_title\
    and tname = :tname\
    and first_second = :first_second\
    and semester = :semester";

exports.SetFirstSecond="\
    update research_student set first_second = '1' \
    where student_id = :student_id and first_second = '3'";

exports.CreateResearchFile="\
    insert into research_file \
    values(:research_title, :tname, :file_name, :first_second, :file_path, :file_type)";

exports.CreateResearchApplyForm="\
    insert into research_apply_form\
    values(:student_id, :research_title, :tname, 0, :first_second, :semester)";

exports.AddPhone="\
    update student set phone = :phone\
    where student_id = :student_id";

exports.AddEmail="\
    update student set email = :email \
    where student_id = :id";

exports.SetResearchApplyFormStatus="\
    update research_apply_form set agree = :agree \
    where research_title = :research_title and tname = :tname \
    and first_second = :first_second \
    and semester = :semester";

exports.DeleteResearchApplyForm="\
    delete from research_apply_form \
    where research_title = :research_title and \
    tname = :tname and first_second = :first_second \
    and semester = :semester";
