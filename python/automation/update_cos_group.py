import ast
from datetime import date
import connect
import os

## This is an auto-update script for `cos_group` table.
## It will query the newest course cos_code for the following course.
##      (1) the course which has already in the `cos_group` table.
##      (2) the course which is in `cos_type` table for that year's graduation rules.
## 
## This script may need to be modified if the graduation rules have changed.
## This script is currently (109/2/14) following the follow rules.
##
## Rule:
##      必修課程須修習本系所開授之課程
##      (例外：
##          ①三選一課程；
##          ②微積分課程；
##          ③「電資共同」下所開授的「微分方程」和「訊號與系統」課程，不論是否為本系教師所開，皆可計入
##      )
##      若要修習外系所課程來抵免本系必修，須透過申請，系統請不要預設課程名稱一致者，即學生擬申請拿來抵免本系必修課程，這樣會誤導學生以為該門課可以抵免，只是缺少申請手續而已。
##      ※「訊號與系統」和「微分方程」請用開課單位(電資共同)+課程名稱(微分方程或訊號與系統)一起核對，符合就可計入。


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
    mycursor.execute('''
        select `cos_cname` from `cos_type` where school_year={}
    '''.format(year))
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
            mycursor.execute('''
                select distinct cd.cos_code, cos_cname
                from cos_data as cd, cos_name as cn
                where cn.unique_id=cd.unique_id
                and cd.unique_id like '{}%'
                and cn.cos_cname like '{}%'
                and (
                    cd.cos_code like 'DCP%'
                    or cd.cos_code like 'IOC%'
                    or (cd.dep_id='Y1' and '{}' like '微分方程%')
                    or (cd.dep_id='Y1' and '{}' like '訊號與系統%')
                    ); 
            '''.format(year_sem, cos_key, cos_key, cos_key))  ## dep_id='Y1' ==> 開課單位'電資共同'
            data = mycursor.fetchall()
            for item in data:
                cos_code, cos_cname = item[0], item[1]
                if check_cos_name(cos_key, cos_cname) and cos_code not in cur_cos_grp[cos_key]:
                    cur_cos_grp[cos_key].append(cos_code)
    
    ## Process 微積分
    mycursor.execute('''
        select distinct cd.cos_code, cn.cos_cname
        from cos_data as cd, cos_name as cn 
        where cn.unique_id=cd.unique_id 
        and cd.unique_id like '{}%'
        and cn.cos_cname like '微積分甲%';
    '''.format(year_sem))
    data = mycursor.fetchall()
    for item in data:
        cos_code, cos_cname = item[0], item[1]
        cos_cname = cos_cname.replace('甲','')
        cos_cname = cos_cname.replace('（','(')
        cos_cname = cos_cname.replace('）',')')
        if cos_cname in cur_cos_grp and cos_code not in cur_cos_grp[cos_cname]:
            cur_cos_grp[cos_cname].append(cos_code)
    
    ## Process 物化生三選一
    mycursor.execute('''
        select distinct cd.cos_code, cos_cname 
        from cos_data as cd, cos_name as cn 
        where cn.unique_id=cd.unique_id 
        and cd.unique_id like '{}%'
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
    '''.format(year_sem))
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
        f.write("'cos_cname','cos_ename','cos_codes'\n")
        for key in new_cos_grp:
            if key in mapping_dict:
                cos_ename = mapping_dict[key]
            else:
                cos_ename = ''

            cos_codes_str = '['
            for code in new_cos_grp[key]:
                cos_codes_str += '"{}",'.format(code)
            if len(new_cos_grp[key]) == 0:
                cos_codes_str += ']'
            else:
                cos_codes_str = cos_codes_str[:-1] + ']'
            f.write("'{}','{}','{}'\n".format(key, cos_ename, cos_codes_str))
    
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
    os.remove('./new_cos_group.csv')

if __name__ == '__main__':
    mycursor, connection = connect.connect2db()
    cur_cos_grp, mapping_dict = get_cur_cos_grp()
    
    ## Get newest course semester
    year, sem = get_newest_cos_sem()
    print(year,sem)

    ## Get all cos group keys
    cos_grp_keys = get_all_cos_group_keys(mycursor, cur_cos_grp, year)

    ## Fill cur_cos_grp with empty list
    for key in cos_grp_keys:
        if key not in cur_cos_grp:
            cur_cos_grp[key] = []

    ## Update cos group
    new_cos_grp = update_cos_grp(mycursor, cur_cos_grp, cos_grp_keys, '{}-{}'.format(year, sem))

    ## Update DB
    update_db_cos_grp(mycursor, connection, new_cos_grp, mapping_dict)