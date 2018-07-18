var Client = require('mariasql');
var s = require('./sqlString.js');
var psw = require('./dbpsw');


var pool = psw.dbpsw();


function parseEng(cos){
    if(cos.indexOf('英文授課')>-1)
        cos=cos.substring(0, cos.length-6);
    else if(cos.indexOf('(英文班')>-1)
        cos=cos.substring(0, cos.length-5);
    else if(cos.indexOf('(英文')>-1 || cos.indexOf('（英文')>-1)
        cos=cos.substring(0, cos.length-4);
    else if(cos.indexOf('(英')>-1 || cos.indexOf('（英')>-1)
        cos=cos.substring(0, cos.length-3);
    return cos;
}

function parseHonor(cos){
    if(cos.indexOf('榮譽班')>-1)
        cos=cos.substring(0, cos.length-3);
    return cos
}

module.exports = {

    findPerson: function(id, callback) {
        if (id.match(/^[0-9].*/g)) {
            const resource = pool.acquire();
            resource.then(function(c) {
                var sql_findStudent = c.prepare(s.findStudent);
                var sql_findCrossStudent = c.prepare(s.findCrossStudent);
                c.query(sql_findCrossStudent({id}), function(err, result){
                    if(err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    if(result.length)
                    {
                        result[0]['status'] = 'c';
                        callback(null, JSON.stringify(result));
                        pool.release(c);
                    }
                    else
                    {
                        c.query(sql_findStudent({ id: id }), function(err, result) {
                            if (err){
                                callback(err, undefined);
                                pool.release(c);
                                return;
                            }
                            if (result.info.numRows != 0) {
                                result[0]['status'] = 's';
                                if (id=='0316201'||id=='0312512'||id=='0416014'||id=='0416008'||id=='0416081'||id=='0516003'||id=='0516205')
                                    result[0]['status'] = 'w';
                            }
                            callback(null, JSON.stringify(result));
                            pool.release(c);
                        })
                    }
                })
            });
        } else if (id.match(/^T.*/g)) {
            const resource = pool.acquire();
            resource.then(function(c) {
                var sql_findProfessor = c.prepare(s.findProfessor);
                c.query(sql_findProfessor({ id: id }), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    if (result.info.numRows != 0)
                        result[0]['status'] = 'p';
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            })
        } else {
            const resource = pool.acquire();
            resource.then(function(c) {
                var sql_findAssistant = c.prepare(s.findAssistant);
                c.query(sql_findAssistant({ id: id }), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    if (result.info.numRows != 0)
                        result[0]['status'] = 'a';
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            })
        }
    }, 
    addEmail: function(id, email) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_addEmail = c.prepare(s.addEmail);
            c.query(sql_addEmail({ id: id, email: email }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            });
        })
    }, 
    showCosMap: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_showCosMap = c.prepare(s.showCosMap);
            var year = '1' + id[0] + id[1];
            c.query(sql_showCosMap({ id: id, year: year }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        })
    }, 
    showCosMapPass: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_showCosMapPass = c.prepare(s.showCosMapPass);
            c.query(sql_showCosMapPass({ id: id }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                for(var i in result){
                    if(result[i]['cos_cname']==='微積分Ａ（一）' || result[i]['cos_cname']==='微積分Ｂ（一）' || result[i]['cos_cname']==='微積分甲（一）')
                        result[i]['cos_cname']='微積分(一)';
                    else if(result[i]['cos_cname']==='微積分Ａ（二）' || result[i]['cos_cname']==='微積分Ｂ（二）' || result[i]['cos_cname']==='微積分甲（二）')
                        result[i]['cos_cname']='微積分(二)';
                    if(typeof(result[i]['cos_cname'])==='string')
                        result[i]['cos_cname']=parseHonor(parseEng(result[i]['cos_cname']));
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    }, 
    totalCredit: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_totalCredit = c.prepare(s.totalCredit);
            c.query(sql_totalCredit({ id: id }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
    }, 
    Pass: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_Pass = c.prepare(s.Pass);
            var year = '1' + id[0] + id[1];
            c.query(sql_Pass({ id: id, year: year }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
    }, 
    PassSpecify: function(id, category, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_PassSpecify = c.prepare(s.PassSpecify);
            var year = '1' + id[0] + id[1];
            c.query(sql_PassSpecify({id, year, category}), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
    }, 
    Group: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_Group = c.prepare(s.Group);
            var year = '1' + id[0] + id[1];
            c.query(sql_Group({ id: id, year: year }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result).replace(/\"\[/g, "\[").replace(/\]\"/g, "\]").replace(/\\\"/g, "\""));
                pool.release(c);
            })
        })
    }, 
    graduateRule: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_graduateRule = c.prepare(s.graduateRule);
            var year = '1' + id[0] + id[1];
            c.query(sql_graduateRule({ id: id, year: year }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
    }, 
    studentGraduateList: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            if( id != 'all'){
                var sql_studentGraduateList_single = c.prepare(s.studentGraduateList_single);
                var sem = id[0] + id[1];
                c.query(sql_studentGraduateList_single({ sem: sem }), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                })
            }else{
                var sql_studentGraduateList_all = c.prepare(s.studentGraduateList_all);
                c.query(sql_studentGraduateList_all({}), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                })
            }
            
        })
    }, 
    SetStudentGraduateStatus: function(id, graduate) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_SetStudentGraduateStatus = c.prepare(s.SetStudentGraduateStatus);
            c.query(sql_SetStudentGraduateStatus({ id: id, graduate: graduate }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            })
        })
    }, 
    SetGraduateSubmitStatus: function(id, graduate_submit) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_SetGraduateSubmitStatus = c.prepare(s.SetGraduateSubmitStatus);
            c.query(sql_SetGraduateSubmitStatus({ id: id, graduate_submit: graduate_submit }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            })
        })
    }, 
    bindAccount: function(id, str, type) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_setGmail = c.prepare(s.setGmail);
            var sql_setFbId = c.prepare(s.setFbId);
            var sql_setGithubId = c.prepare(s.setGithubId);
            if (type === 1)
                c.query(sql_setGmail({ id: id, gmail: str }), function(err, result) {
                    if (err)
                        throw err;
                    pool.release(c);
                });
            else if (type === 2)
                c.query(sql_setFbId({ id: id, fb_id: str }), function(err, result) {
                    if (err)
                        throw err;
                    pool.release(c);
                });
            else if (type === 3)
                c.query(sql_setGithubId({ id: id, github_id: str }), function(err, result) {
                    if (err)
                        throw err;
                    pool.release(c);
                });
        });
    }, 
    offset: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            if (id != 'all') {
                var sql_offset = c.prepare(s.offset_single);
                c.query(sql_offset({ id: id }), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            } else {
                var sql_offset = c.prepare(s.offset_all);
                c.query(sql_offset({}), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            }
        });
    }, 
    on_cos_data: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_on_cos_data = c.prepare(s.on_cos_data);
            c.query(sql_on_cos_data({ id: id }), function(err, result) {
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
    general_cos_rule: function(callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_general_cos_rule = c.prepare(s.general_cos_rule);
            c.query(sql_general_cos_rule({}), function(err, result) {
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
    SetEnCertificate: function(id, check) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_SetEnCertificate = c.prepare(s.SetEnCertificate);
            c.query(sql_SetEnCertificate({ id: id, check: check }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    insertCosMotion: function(id, name, orig, now){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_insertCosMotion=c.prepare(s.insertCosMotion);
            c.query(sql_insertCosMotion({id:id, name:name, orig:orig, now:now}), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    cosMotion: function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_cosMotion=c.prepare(s.cosMotion);
            c.query(sql_cosMotion({id:id}), function(err, result){
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
    cosMotionDelete:function(id){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_cosMotionDelete=c.prepare(s.cosMotionDelete);
            c.query(sql_cosMotionDelete({id:id}), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    CreateQA:function(que, ans, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_CreateQA=c.prepare(s.CreateQA);
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
                c.query(sql_CreateQA({id:id, que:que, ans:ans}), function(err, result){
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
    DeleteQA:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_DeleteQA=c.prepare(s.DeleteQA);
            c.query(sql_DeleteQA({id:id}), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    ShowAllQA:function(callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowAllQA=c.prepare(s.ShowAllQA);
            c.query(sql_ShowAllQA({}), function(err, result){
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
    teacherCosNow:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_teacherCosNow=c.prepare(s.teacherCosNow);
            c.query(sql_teacherCosNow({id: id}), function(err, result){
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
    teacherCosAll:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_teacherCosAll=c.prepare(s.teacherCosAll);
            c.query(sql_teacherCosAll({id: id}), function(err, result){
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
    teacherStudents:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_teacherStudents=c.prepare(s.teacherStudents);
            c.query(sql_teacherStudents({id:id}), function(err, result){
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
    showCosMapIntro:function(cos_cname, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_showCosMapIntro=c.prepare(s.showCosMapIntro);
            c.query(sql_showCosMapIntro({cos_cname: cos_cname}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                // if one course has many teachers 
                for(let i = 0; i < result.length; i++){
                    let j = 0
                    while(1){
                        if((i+j+1) == result.length)    // the last element
                            break;
                        if(result[i].unique_id == result[i+j+1].unique_id)
                        {
                            result[i].tname = result[i].tname + ' '+ result[i+j+1].tname;
                            j++;
                        }
                        else break;
                    }
                    result.splice(i+1, j);
                    if((i+1) == result.length)
                        break;
                }
                // if one course is taught in english
                for(let i in result){
                    if(result[i].english == '英文授課')
                        result[i].english = true;
                    else
                        result[i].english = false;
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
    showCosScoreInterval: function(cos_code, unique_id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_showCosScoreInterval=c.prepare(s.showCosScoreInterval);
            c.query(sql_showCosScoreInterval({cos_code: cos_code, unique_id: unique_id}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                var interval=[];
                for(let i in result[0])
                    interval.push(Number(result[0][i]));
                callback(null, JSON.stringify(interval));
                pool.release(c);
            });
        });
    }, 
    getRecommend:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var semester='106-2%';
            var sql_getRecommend=c.prepare(s.getRecommend);
            var sql_findCurrentCos=c.prepare(s.findCurrentCos);
            var sql_findTeacher=c.prepare(s.findTeacher);
            var result=[];
            c.query(sql_getRecommend({id:id}), function(err, reclist){
                c.query(sql_findCurrentCos({semester}), function(err, cos){
                    c.query(sql_findTeacher({}), function(err, tea){
                        //select all recommend cos to variable rec
                        if(reclist.length==0)
                        {
                            pool.release(c);
                            callback(null, JSON.stringify([]));
                            return;
                        }
                        reclist=reclist[0]['cos_name_list'];
                        let rec=reclist.split(", ");

                        cos=JSON.parse(JSON.stringify(cos));
                        tea=JSON.parse(JSON.stringify(tea));

                        for(let i=0;i<rec.length;i++){
                            //select all cos info into variable data
                            let data=cos.filter(function(c){return parseEng(c.cos_cname)===rec[i]});
                            
                            //for every cos data
                            for(let d_num=0;d_num<data.length;d_num++)
                            {
                                //select all teacher who teach the recommend cos
                                var tea_list=data[d_num]['teacher_id'].split(", ");

                                //for every teacher
                                for(let k=0;k<tea_list.length;k++)
                                    //iterate all teacher list 
                                    for(let j=0;j<tea.length;j++)
                                        //select the teacher name
                                        if(tea_list[k].indexOf(tea[j]['teacher_id'])>-1)
                                        {
                                            tea_list[k]=tea[j]['tname'];
                                            break
                                        }
                                delete data[d_num]['teacher_id'];
                                data[d_num]['teacher']=tea_list.join(', ');
                                data[d_num]['cos_time']=data[d_num]['cos_time'].split('-')[0];
                                
                                result.push(data[d_num]);
                            }
                        }

                        pool.release(c);
                        callback(null, JSON.stringify(result));
                    });
                });
            });
        });
    }, 
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
    CreateMail:function(data){
        //data need sender_id, title, receiver_id, content
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_CreateMailSender=c.prepare(s.CreateMailSender);
            var sql_CreateMailReceiver=c.prepare(s.CreateMailReceiver);
            c.query(sql_CreateMailSender(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                c.query(sql_CreateMailReceiver(data), function(err){
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
    DeleteMail:function(mail_id){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_DeleteMail=c.prepare(s.DeleteMail);
            c.query(sql_DeleteMail({mail_id}), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    SetMailRead:function(mail_id, read_bit){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetMailRead=c.prepare(s.SetMailRead);
            c.query(sql_SetMailRead({mail_id, read_bit}), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    ShowMailInfo:function(mail_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowMailInfo=c.prepare(s.ShowMailInfo);
            c.query(sql_ShowMailInfo({mail_id}), function(err, result){
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
    ShowMailRcdList:function(receiver_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowMailRcdList=c.prepare(s.ShowMailRcdList);
            c.query(sql_ShowMailRcdList({receiver_id}), function(err, result){
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
    ShowMailSendList:function(sender_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowMailSendList=c.prepare(s.ShowMailSendList);
            c.query(sql_ShowMailSendList({sender_id}), function(err, result){
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
    returnStudentIdList:function(callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_returnStudentIdList=c.prepare(s.returnStudentIdList);
            c.query(sql_returnStudentIdList({}), function(err, result){
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
    returnTeacherIdList:function(callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_returnTeacherIdList=c.prepare(s.returnTeacherIdList);
            c.query(sql_returnTeacherIdList({}), function(err, result){
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
    CreateResearchApplyForm:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_addPhone=c.prepare(s.addPhone);
            var sql_CreateResearchApplyForm=c.prepare(s.CreateResearchApplyForm);
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
                    c.query(sql_CreateResearchApplyForm(data), function(err){
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
    SetResearchApplyFormStatus:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetResearchApplyFormStatus=c.prepare(s.SetResearchApplyFormStatus);
            c.query(sql_SetResearchApplyFormStatus(data), function(err, result){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    DeleteResearchApplyForm:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_DeleteResearchApplyForm=c.prepare(s.DeleteResearchApplyForm);
            c.query(sql_DeleteResearchApplyForm(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
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
    ShowStudentResearchApplyForm:function(student_id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowStudentResearchApplyForm=c.prepare(s.ShowStudentResearchApplyForm);
            c.query(sql_ShowStudentResearchApplyForm({student_id}), function(err, result){
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
    SetResearchInfo:function(data, callback){
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
    SetResearchScoreComment:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_setResearchScore=c.prepare(s.setResearchScore);
            var sql_setResearchComment=c.prepare(s.setResearchComment);
            c.query(sql_setResearchScore(data), function(err){
                if(err)
                {
                    throw err;
                }
            });
            c.query(sql_setResearchComment(data), function(err){
                if(err)
                {
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    CreateNewResearch:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_CreateNewResearch=c.prepare(s.CreateNewResearch);
            c.query(sql_CreateNewResearch(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    CreateResearchFile:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_CreateResearchFile=c.prepare(s.CreateResearchFile);
            c.query(sql_CreateResearchFile(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
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
    SetResearchTitle:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetResearchTitle=c.prepare(s.SetResearchTitle);
            c.query(sql_SetResearchTitle(data), function(err){
                if(err)
                    throw err;
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
    mentorReturn:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_mentorReturn = c.prepare(s.mentorReturn);
            c.query(sql_mentorReturn({id}), function(err, result){
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
    Drain: function() {
        pool.drain().then(function() {
            pool.clear();
        });
    }
};