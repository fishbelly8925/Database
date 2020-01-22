select distinct 
    (TRIM(TRAILING '(學而班)' from
    (TRIM(TRAILING '(英文班)' from
    (TRIM(TRAILING '（英）' from
    (TRIM(TRAILING '(英' from
    (TRIM(TRAILING '(英文授課）' from
    (TRIM(TRAILING '(英文)' from 
    (TRIM(TRAILING '(英)' from
    (TRIM(TRAILING '(英文授課)' from combin.cos_cname)))))))))))))))) as cos_name,
  teacher.tname as teacher_name
from (
    select cos_name.cos_cname, cos_data.teacher_id 
    from (
        select unique_id, cos_cname
        from cos_name 
        where (cos_code like 'DCP%' 
            or cos_code like 'IOC%' 
            or cos_code like 'IOE%' 
            or cos_code like 'ILE%' 
            or cos_code like 'IDS%' 
            or cos_code like 'CCS%' 
            or cos_code like 'ICP%')
            and unique_id like '10%' 
            and cos_cname not like '博士班書報%'
            and cos_cname not like '論文研討%'
            and cos_cname not like '個別研究%'
            and cos_cname not like '博士學位%'
            and cos_cname not like '教學實務%'
            and cos_cname not like '資訊工程研討%'
            and cos_cname not like '資訊工程專題%'
            and cos_cname not like '%導師時間%'
            and cos_cname not like '跨領域專題%'
            and cos_cname not like '服務學習%'
    ) as cos_name, (
        select unique_id, teacher_id 
        from cos_data 
        where (cos_code like 'DCP%' 
            or cos_code like 'IOC%' 
            or cos_code like 'IOE%' 
            or cos_code like 'ILE%' 
            or cos_code like 'IDS%' 
            or cos_code like 'CCS%' 
            or cos_code like 'ICP%')
    ) as cos_data 
    where cos_data.unique_id = cos_name.unique_id
) as combin, teacher_cos_relation as teacher 
where combin.teacher_id like concat('%', teacher.teacher_id, '%')
order by cos_name;