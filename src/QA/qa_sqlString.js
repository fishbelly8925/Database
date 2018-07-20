exports.CreateQA="\
    insert into qa_record (id, que, ans)\
    values (:id, :que, :ans)";

exports.ShowAllQA="\
    select *\
    from qa_record";

exports.DeleteQA="\
    delete from qa_record\
    where id = :id";

exports.qaMaxId="\
    select max(id) as maxID\
    from qa_record";
