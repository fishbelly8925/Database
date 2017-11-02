# csca_db
### please npm install the following packages before using
1. [mariasql](https://github.com/mscdex/node-mariasql)
2. [line-reader](https://github.com/nickewing/line-reader)
3. [generic-pool](https://github.com/coopernurse/node-pool)

## Introduction

### Personal Information of Student
| function | description |
| ------- | ----- |
| findPerson(id,cb) | return someone's profile |
| addEmail(student_id,email) | update student's e-mail |

### Course Map
| function | description |
| ------- | ----- |
| showCosMap(student_id,cb) | return the Course Map and suggest,required course relation |
| showCosMapPass(student_id,cb) | return the passing course in Course Map |

### Course Pass and Grade
| function | description |
| ------- | ----- |
| totalCredit(student_id,cb) | return someone's total credits |
| Pass(student_id,cb) | return all of someone's course score |
| Group(student_id,cb) | return the relation between cos_name,cos_code and cos_type of that student |
| graduateRule(student_id,cb) | return the graduate rule of this student |
| setStudentGraduateSubmit(student_id,graduate_submit) | set the graduate submit status(1 for submit, 0 for not yet) |


### Assistant
| function | description |
| ------- | ----- |
| studentGraduateList(first and second digit of student_id,cb) | return the students graduate imformation |
| setStudentGraduate(student_id,graduate_situation) | set the graduate value of this student(1 for pass,0 for not pass) |
