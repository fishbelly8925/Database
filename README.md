# csca_db
### please npm install the following packages before using
1. [mariasql](https://github.com/mscdex/node-mariasql)
2. [line-reader](https://github.com/nickewing/line-reader)
3. [generic-pool](https://github.com/coopernurse/node-pool)

## Introduction

### Personal Information of Student
* findPerson(student_id,cb) 回傳學生資料
* addEmail(student_id,email) 更新學生email

### Course Map
* showCosMap(student_id,cb) 課程地圖要顯示的項目以及建議先修課與擋修課程
* showCosMapPass(student_id,cb) 課程地圖上有通過的課

### Course Pass and Grade
* a_uploadGrade(file_path) 助理上傳成績
* totalCredit(student_id,cb) 計算某學生必選修學分數  ((目前仍有bug
* oldGeneralCredit(student_id,cb) 計算某學生舊版通識學分數 ((目前仍有bug
* Pass(student_id,cb) 列出此學生通過的課
