def update_db_student_grad_rule_year(mycurser, connection):
    ## This function will update those student whose grad_rule_year attribute is NULL.
    ## The default value will be '1'+std_id[0]+std_id[1]
    sql = '''
        update student 
        set grad_rule_year=convert(concat('1', substring(student_id, 1, 2)), SIGNED)
        where grad_rule_year is NULL;
    '''
    try:
        mycurser.execute(sql)
    except Exception as e:
        print(e)
        connection.rollback()
    else:
        print('Success')
        connection.commit()