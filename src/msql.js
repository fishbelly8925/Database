var s = require('./sqlString.js');
var psw = require('./dbpsw');

var pool = psw.dbpsw();

function merge(modu){
    result={}
    for(var idx in modu)
        for(var i in modu[idx])
            result[i]=modu[idx][i];
    return result;
}
var drain = {
        Drain: function() {
            pool.drain().then(function() {
                pool.clear();
            });
        }}
var student = require('./student/student_msql.js');
var course = require('./course/course_msql.js');
var teacher = require('./teacher/teacher_msql.js');

module.exports = merge([student,course,teacher,drain]);

a= {  
    a_uploadGrade: function(pt) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_a_uploadGrade = c.prepare(s.a_uploadGrade);
            c.query(sql_a_uploadGrade({ pt: pt }, function(err) {
                if (err)
                    throw err;
                pool.release(c);
            }));
        });
    },   
    setStudentGraduate: function(id, graduate) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_setStudentGraduate = c.prepare(s.setStudentGraduate);
            c.query(sql_setStudentGraduate({ id: id, graduate: graduate }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            })
        })
    }, 
    setStudentGraduateSubmit: function(id, graduate_submit) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_setStudentGraduateSubmit = c.prepare(s.setStudentGraduateSubmit);
            c.query(sql_setStudentGraduateSubmit({ id: id, graduate_submit: graduate_submit }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            })
        })
    },  
    setEnCertificate: function(id, check) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_setEnCertificate = c.prepare(s.setEnCertificate);
            c.query(sql_setEnCertificate({ id: id, check: check }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            });
        });
    },   
    qaInsert:function(que, ans, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_qaInsert=c.prepare(s.qaInsert);
            var sql_qaMaxId=c.prepare(s.qaMaxId);
            c.query(sql_qaMaxId({}), function(err, result){
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                var id=0;
                if(result[0]['maxID']!=null)
                    id=parseInt(result[0]['maxID'])+1;
                c.query(sql_qaInsert({id:id, que:que, ans:ans}), function(err, result){
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            });
        });
    }, 
    qaDelete:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_qaDelete=c.prepare(s.qaDelete);
            c.query(sql_qaDelete({id:id}), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    qaSearch:function(callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_qaSearch=c.prepare(s.qaSearch);
            c.query(sql_qaSearch({}), function(err, result){
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    },  
    showCosScoreDetail: function(cos_code, unique_id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_showCosScoreDetail=c.prepare(s.showCosScoreDetail);
            c.query(sql_showCosScoreDetail({cos_code: cos_code, unique_id: unique_id}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    findTeacherResearch: function(teacher_id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_findTeacherResearch=c.prepare(s.findTeacherResearch);
            c.query(sql_findTeacherResearch({teacher_id}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                if(result.length==0)
                {
                    callback(null, "[]");
                    pool.release(c);
                    return;
                }
                var year=parseInt(result[0]['student_id'].substring(0, 2));
                var idx;
                for(idx in result)
                {
                    if(idx=='info')
                    {
                        idx=result.length;
                        break;
                    }
                    if(year-parseInt(result[idx]['student_id'].substring(0, 2))>2)
                        break
                }
                callback(null, JSON.stringify(result.slice(0, idx)));
                pool.release(c);
            });
        });
    }, 
    findTeacherResearchCountAndInfo: function(callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_findTeacherResearchCountAndInfo=c.prepare(s.findTeacherResearchCountAndInfo);
            c.query(sql_findTeacherResearchCountAndInfo({}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                var gradeCnt, temp={}, i, res=[];
                result=JSON.parse(JSON.stringify(result));
                for(i in result){
                    gradeCnt={grade:result[i].grade, scount:result[i].scount};
                    if(i==0){
                        temp={tname:result[i].tname, teacher_id:result[i].teacher_id, 
                            phone:result[i].phone, email:result[i].email, 
                            expertise:result[i].expertise, 
                            info:result[i].info, gradeCnt:[gradeCnt]};
                    }
                    else if(result[i].tname===temp.tname){
                        temp.gradeCnt.push(gradeCnt);
                    }
                    else{   
                        res.push(temp);
                        temp={tname:result[i].tname, teacher_id:result[i].teacher_id, 
                            phone:result[i].phone, email:result[i].email, 
                            expertise:result[i].expertise, 
                            info:result[i].info, gradeCnt:[gradeCnt]};
                    }
                }
                if(res[res.length-1].tname!==temp.tname)
                    res.push(temp);
                callback(null, JSON.stringify(res));
                pool.release(c);
            });
        });
    }, 
    mailCreate:function(data){
        //data need sender_id, title, receiver_id, content
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_mailCreateSender=c.prepare(s.mailCreateSender);
            var sql_mailCreateReceiver=c.prepare(s.mailCreateReceiver);
            c.query(sql_mailCreateSender(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                c.query(sql_mailCreateReceiver(data), function(err){
                    if(err)
                    {
                        pool.release(c);
                        throw err;
                    }
                    pool.release(c);
                });
            });
        });
    }, 
    mailDelete:function(mail_id){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_mailDelete=c.prepare(s.mailDelete);
            c.query(sql_mailDelete({mail_id}), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    mailReadSet:function(mail_id, read_bit){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_mailReadSet=c.prepare(s.mailReadSet);
            c.query(sql_mailReadSet({mail_id, read_bit}), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    mailReturnSingle:function(mail_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_mailReturnSingle=c.prepare(s.mailReturnSingle);
            c.query(sql_mailReturnSingle({mail_id}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    mailReturnReceiveList:function(receiver_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_mailReturnReceiveList=c.prepare(s.mailReturnReceiveList);
            c.query(sql_mailReturnReceiveList({receiver_id}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    mailReturnSendList:function(sender_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_mailReturnSendList=c.prepare(s.mailReturnSendList);
            c.query(sql_mailReturnSendList({sender_id}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    researchApplyFormCreate:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_addPhone=c.prepare(s.addPhone);
            var sql_researchApplyFormCreate=c.prepare(s.researchApplyFormCreate);
            var sql_addEmail=c.prepare(s.addEmail);
            c.query(sql_addPhone({student_id:data['student_id'], phone:data['phone']}), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                c.query(sql_addEmail({id:data['student_id'], email:data['email']}), function(err){
                    if(err)
                    {
                        pool.release(c);
                        throw err;
                    }
                    c.query(sql_researchApplyFormCreate(data), function(err){
                        if(err)
                        {
                            pool.release(c);
                            throw err;
                        }
                        pool.release(c);
                    });
                });
            });
        });
    }, 
    researchApplyFormSetAgree:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_researchApplyFormSetAgree=c.prepare(s.researchApplyFormSetAgree);
            c.query(sql_researchApplyFormSetAgree(data), function(err, result){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    researchApplyFormDelete:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_researchApplyFormDelete=c.prepare(s.researchApplyFormDelete);
            c.query(sql_researchApplyFormDelete(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    researchApplyFormTeaReturn:function(teacher_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_researchApplyFormTeaReturn=c.prepare(s.researchApplyFormTeaReturn);
            c.query(sql_researchApplyFormTeaReturn({teacher_id}), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    researchApplyFormPersonalReturn:function(student_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_researchApplyFormPersonalReturn=c.prepare(s.researchApplyFormPersonalReturn);
            c.query(sql_researchApplyFormPersonalReturn({student_id}), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    showGivenGradeStudentResearch:function(grade, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_showGivenGradeStudentResearch=c.prepare(s.showGivenGradeStudentResearch);
            c.query(sql_showGivenGradeStudentResearch({grade}), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    showResearchPage:function(student_id, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_showResearchPage=c.prepare(s.showResearchPage);
            c.query(sql_showResearchPage({student_id}), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    findResearchGroup:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_findResearchGroup=c.prepare(s.findResearchGroup);
            c.query(sql_findResearchGroup(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    setResearchPage:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_setResearchTitle=c.prepare(s.setResearchTitle);
            var sql_setResearchLink=c.prepare(s.setResearchLink);
            var sql_setResearchIntro=c.prepare(s.setResearchIntro);

            c.query(sql_setResearchTitle({research_title: data['research_title'], tname: data['tname'], first_second:data['first_second'], semester:data['semester'], new_title: data['new_title']}), function(err, result){
                if(err)
                    throw err;
                c.query(sql_setResearchLink({research_title: data['research_title'], tname: data['tname'], first_second:data['first_second'], semester:data['semester'], new_link: data['new_link']}), function(err, result){
                    if(err)
                        throw err;
                    c.query(sql_setResearchIntro({research_title: data['research_title'], tname: data['tname'], first_second:data['first_second'], semester:data['semester'], new_intro: data['new_intro']}), function(err, result){
                        if(err)
                            throw err;
                        pool.release(c);    
                    });
                });
            });
        });
    }, 
    setResearchScoreComment:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_setResearchScore=c.prepare(s.setResearchScore);
            var sql_setResearchComment=c.prepare(s.setResearchComment);
            c.query(sql_setResearchScore(data), function(err,value){
                if(err)
                {
                    throw err;
                }
            });
            c.query(sql_setResearchComment(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    createNewResearch:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_createNewResearch=c.prepare(s.createNewResearch);
            c.query(sql_createNewResearch(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    researchFileCreate:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_researchFileCreate=c.prepare(s.researchFileCreate);
            c.query(sql_researchFileCreate(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    researchFileReturn:function(data, callback){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_researchFileReturn=c.prepare(s.researchFileReturn);
            c.query(sql_researchFileReturn(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    showResearchInfo:function(data, callback){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_showResearchInfo=c.prepare(s.showResearchInfo);
            c.query(sql_showResearchInfo(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    updateResearchTitle:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_updateResearchTitle=c.prepare(s.updateResearchTitle);
            c.query(sql_updateResearchTitle(data), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    showResearchGradeComment:function(data, callback){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_showResearchGradeComment=c.prepare(s.showResearchGradeComment);
            c.query(sql_showResearchGradeComment(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    throw err;
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }
};