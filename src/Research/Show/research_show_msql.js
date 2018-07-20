var CONST = require('../../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./research_show_sqlString.js');

var pool = psw.dbpsw();

module.exports = {
	ShowTeacherResearchStudent: function(teacher_id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherResearchStudent=c.prepare(s.ShowTeacherResearchStudent);
            c.query(sql_ShowTeacherResearchStudent({teacher_id}), function(err, result){
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
    ShowTeacherInfoResearchCnt: function(callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherInfoResearchCnt=c.prepare(s.ShowTeacherInfoResearchCnt);
            c.query(sql_ShowTeacherInfoResearchCnt({}), function(err, result){
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
    ShowGivenGradeStudentResearch:function(grade, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowGivenGradeStudentResearch=c.prepare(s.ShowGivenGradeStudentResearch);
            c.query(sql_ShowGivenGradeStudentResearch({grade}), function(err, result){
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
    ShowStudentResearchInfo:function(student_id, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowStudentResearchInfo=c.prepare(s.ShowStudentResearchInfo);
            c.query(sql_ShowStudentResearchInfo({student_id}), function(err, result){
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
    ShowResearchGroup:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowResearchGroup=c.prepare(s.ShowResearchGroup);
            c.query(sql_ShowResearchGroup(data), function(err, result){
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
    ShowResearchFilePath:function(data, callback){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowResearchFilePath=c.prepare(s.ShowResearchFilePath);
            c.query(sql_ShowResearchFilePath(data), function(err, result){
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
    ShowResearchInfo:function(data, callback){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowResearchInfo=c.prepare(s.ShowResearchInfo);
            c.query(sql_ShowResearchInfo(data), function(err, result){
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
    ShowResearchScoreComment:function(data, callback){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowResearchScoreComment=c.prepare(s.ShowResearchScoreComment);
            c.query(sql_ShowResearchScoreComment(data), function(err, result){
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
    ShowTeacherResearchApplyFormList:function(teacher_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherResearchApplyFormList=c.prepare(s.ShowTeacherResearchApplyFormList);
            c.query(sql_ShowTeacherResearchApplyFormList({teacher_id}), function(err, result){
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
    ShowStudentResearchApplyForm:function(student_id, first_second, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowStudentResearchApplyForm=c.prepare(s.ShowStudentResearchApplyForm);
            c.query(sql_ShowStudentResearchApplyForm({student_id, first_second}), function(err, result){
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
    }
};