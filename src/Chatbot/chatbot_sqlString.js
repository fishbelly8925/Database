exports.ShowUserDefined_single = "\
    select *\
    from user_defined\
    where defined_word = :defined_word";

exports.ShowUserDefined_all = "\
    select *\
    from user_defined";