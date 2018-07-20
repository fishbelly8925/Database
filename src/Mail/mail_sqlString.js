exports.CreateMailSender="\
    insert into mail(mail_id, title, sender_id, receiver_id, content)\
    values(concat(:sender_id, '-', CURRENT_TIMESTAMP, '-', :receiver_id),\
    :title, :sender_id, :receiver_id, :content)";

exports.CreateMailReceiver="\
    insert into mail(mail_id, title, sender_id, receiver_id, content)\
    values(concat(:receiver_id, '-', CURRENT_TIMESTAMP, '-', :sender_id),\
    :title, :sender_id, :receiver_id, :content)";

exports.DeleteMail="\
    delete from mail\
    where mail_id = :mail_id";

exports.SetMailRead="\
    update mail set read_bit = :read_bit\
    where mail_id = :mail_id";

exports.ShowMailInfo="\
    select * \
    from mail \
    where mail_id = :mail_id";

exports.ShowMailRcdList="\
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
        where m.sender_id = id.id\
    ) as m, \
    (\
        select student_id as id, sname as name from student\
        union\
        select teacher_id as id, tname as name from teacher\
    ) as id\
    where m.receiver_id = id.id\
    order by m.send_time desc;";

exports.ShowMailSendList="\
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
        where m.sender_id = id.id\
    ) as m, \
    (\
        select student_id as id, sname as name from student\
        union\
        select teacher_id as id, tname as name from teacher\
    ) as id\
    where m.receiver_id = id.id\
    order by m.send_time desc";
