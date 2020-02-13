import ast
import connect
from datetime import date

def print_cos_group(new_cos_group, cos_group=None):
    if not cos_group:
        for new_key in new_cos_group:
            print(f'{new_key}: {new_cos_group[new_key]}')
    else:
        for old_key, new_key in zip(cos_group, new_cos_group):
            print(f'{old_key}: {cos_group[old_key]}')
            print(f'{new_key}: {new_cos_group[new_key]}')
            print('----------------------------------------')

def get_cur_cos_grp():
    ## Get current course group
    ## res_dict: {cos_cname: [cos_codes_list]}
    ## mapping_dict: {cos_cname: cos_ename}
    mycursor.execute('''
        select `cos_cname`, `cos_codes`, `cos_ename` from `cos_group`
    ''')
    data = mycursor.fetchall()
    res_dict = dict()
    mapping_dict = dict()
    for item in data:
        res_dict[item[0]] = ast.literal_eval(item[1])
        mapping_dict[item[0]] = item[2]
    return res_dict, mapping_dict

def get_newest_cos_sem():
    ## Get next (or current) course year and semester

    today = str(date.today()).split('-')
    year, mon = int(today[0])-1911, int(today[1])
    if mon < 6:
        sem = 2
        year -= 1
    elif mon == 12:
        sem = 2
    else:
        sem = 1
    return year, sem

def get_all_cos_group_keys(mycursor, cur_cos_grp, year):
    ## Get all course group keys which need to be updated
    ## [list of course keys]

    cos_grp_keys = set()
    for cos_cname in cur_cos_grp:
        cos_grp_keys.add(cos_cname)
    mycursor.execute(f'''
        select `cos_cname` from `cos_type` where school_year={year}
    ''')
    cur_cos_type_names = mycursor.fetchall()
    for cos_cname in cur_cos_type_names:
        cos_grp_keys.add(cos_cname[0])
    return list(cos_grp_keys)

def check_cos_name(cos_key, cos_cname):
    cos_cname = cos_cname.replace('（','(')
    cos_cname = cos_cname.replace('）',')')
    if len(cos_cname)==len(cos_key) or cos_cname[len(cos_key):] == '(英文授課)':
        return True
    else:
        return False

def update_cos_grp(mycursor, cur_cos_grp, cos_grp_keys, year_sem):
    for cos_key in cos_grp_keys:
        if cos_key not in ['物化生三選一(一)', '物化生三選一(二)', \
            '微積分(一)', '微積分(二)']:
            mycursor.execute(f'''
                select distinct cd.cos_code, cos_cname
                from cos_data as cd, cos_name as cn
                where cn.unique_id=cd.unique_id
                and cd.unique_id like '{year_sem}%'
                and cn.cos_cname like '{cos_key}%'
                and (
                    cd.cos_code like 'DCP%'
                    or cd.cos_code like 'IOC%'
                    or (cd.dep_id='Y1' and '{cos_key}' like '微分方程%')
                    or (cd.dep_id='Y1' and '{cos_key}' like '訊號與系統%')
                    ); 
            ''')  ## dep_id='Y1' ==> 開課單位'電資共同'
            data = mycursor.fetchall()
            for item in data:
                cos_code, cos_cname = item[0], item[1]
                if check_cos_name(cos_key, cos_cname) and cos_code not in cur_cos_grp[cos_key]:
                    cur_cos_grp[cos_key].append(cos_code)
    
    ## Process 微積分
    mycursor.execute(f'''
        select distinct cd.cos_code, cn.cos_cname
        from cos_data as cd, cos_name as cn 
        where cn.unique_id=cd.unique_id 
        and cd.unique_id like '{year_sem}%'
        and cn.cos_cname like '微積分甲%';
    ''')
    data = mycursor.fetchall()
    for item in data:
        cos_code, cos_cname = item[0], item[1]
        cos_cname = cos_cname.replace('甲','')
        cos_cname = cos_cname.replace('（','(')
        cos_cname = cos_cname.replace('）',')')
        if cos_cname in cur_cos_grp and cos_code not in cur_cos_grp[cos_cname]:
            cur_cos_grp[cos_cname].append(cos_code)
    
    ## Process 物化生三選一
    mycursor.execute(f'''
        select distinct cd.cos_code, cos_cname 
        from cos_data as cd, cos_name as cn 
        where cn.unique_id=cd.unique_id 
        and cd.unique_id like '{year_sem}%'
        and (
            cn.cos_cname like '普通生物學%'
            or cn.cos_cname like '化學%'
            or cn.cos_cname like '物理%'
        )
        and (
            cn.cos_cname='普通生物學(一)' or cn.cos_cname='普通生物學（一）'
            or cn.cos_cname='普通生物學(一）' or cn.cos_cname='普通生物學（一)'
            or cn.cos_cname='普通生物學(二)' or cn.cos_cname='普通生物學（二）'
            or cn.cos_cname='普通生物學(二）' or cn.cos_cname='普通生物學（二)'
            or cn.cos_cname='化學(一)' or cn.cos_cname='化學（一）'
            or cn.cos_cname='化學(一）' or cn.cos_cname='化學（一)'
            or cn.cos_cname='化學(二)' or cn.cos_cname='化學（二）'
            or cn.cos_cname='化學(二）' or cn.cos_cname='化學（二)'
            or cn.cos_cname='物理(一)' or cn.cos_cname='物理（一）'
            or cn.cos_cname='物理(一）' or cn.cos_cname='物理（一)'
            or cn.cos_cname='物理(二)' or cn.cos_cname='物理（二）'
            or cn.cos_cname='物理(二）' or cn.cos_cname='物理（二)'
        );
    ''')
    data = mycursor.fetchall()
    for item in data:
        cos_code, cos_cname = item[0], item[1]
        if '一' in cos_cname and cos_code not in cur_cos_grp['物化生三選一(一)']:
            cur_cos_grp['物化生三選一(一)'].append(cos_code)
        elif '二' in cos_cname and cos_code not in cur_cos_grp['物化生三選一(二)']:
            cur_cos_grp['物化生三選一(二)'].append(cos_code)
    
    return cur_cos_grp

def update_db_cos_grp(mycursor, connection, new_cos_grp, mapping_dict):
    with open('./new_cos_group.csv', 'w') as f:
        f.write(f"'cos_cname','cos_ename','cos_codes'\n")
        for key in new_cos_grp:
            if key in mapping_dict:
                cos_ename = mapping_dict[key]
            else:
                cos_ename = ''

            cos_codes_str = '['
            for code in new_cos_grp[key]:
                cos_codes_str += f'"{code}",'
            if len(new_cos_grp[key]) == 0:
                cos_codes_str += ']'
            else:
                cos_codes_str = cos_codes_str[:-1] + ']'
            f.write(f"'{key}','{cos_ename}','{cos_codes_str}'\n")
    
    dump_sql1 = '''
        create temporary table temp_cos_group(
            cos_cname varchar(50),
            cos_ename varchar(80),
            cos_codes text,
            primary key(cos_cname)
        );
    '''
    dump_sql2 = '''
        load data local infile './new_cos_group.csv'
        into table temp_cos_group
        character set UTF8
        fields terminated by ','
        enclosed by "'"
        lines terminated by '\n'
        ignore 1 lines;
    '''
    dump_sql3 = '''
        insert into cos_group
        select cos_cname, cos_ename, cos_codes from temp_cos_group
        on duplicate key update cos_codes = values(cos_codes);
    '''
    dump_sql4 = '''
        drop temporary table temp_cos_group;
    '''
    try:
        mycursor.execute(dump_sql1)
        mycursor.execute(dump_sql2)
        mycursor.execute(dump_sql3)
        mycursor.execute(dump_sql4)
    except Exception as e:
        print(e)
        connection.rollback()
    else:
        print('Success')
        connection.commit()
    

if __name__ == '__main__':
    mycursor, connection = connect.connect2db()
    cur_cos_grp, mapping_dict = get_cur_cos_grp()
    
    ## Get newest course semester
    year, sem = get_newest_cos_sem()

    ## Get all cos group keys
    cos_grp_keys = get_all_cos_group_keys(mycursor, cur_cos_grp, year)

    ## Fill cur_cos_grp with empty list
    for key in cos_grp_keys:
        if key not in cur_cos_grp:
            cur_cos_grp[key] = []

    ## Update cos group
    new_cos_grp = update_cos_grp(mycursor, cur_cos_grp, cos_grp_keys, f'{year}-{sem}')

    # print_cos_group(new_cos_grp)
    update_db_cos_grp(mycursor, connection, new_cos_grp, mapping_dict)