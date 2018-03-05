var Client = require('mariasql');
var s = require('./sqlString.js');
var psw = require('./dbpsw');


var pool = psw.dbpsw();


function parseEng(cos){
    if(cos.indexOf('英文授課')>-1)
        cos=cos.substring(0,cos.length-6);
    else if(cos.indexOf('(英文班')>-1)
        cos=cos.substring(0,cos.length-5);
    else if(cos.indexOf('(英文')>-1 || cos.indexOf('（英文')>-1)
        cos=cos.substring(0,cos.length-4);
    else if(cos.indexOf('(英')>-1 || cos.indexOf('（英')>-1)
        cos=cos.substring(0,cos.length-3);
    return cos;
}

module.exports = {

    findPerson: function(id, callback) {
        if (id.match(/^[0-9].*/g)) {
            const resource = pool.acquire();
            resource.then(function(c) {
                var sql_findStudent = c.prepare(s.findStudent);
                c.query(sql_findStudent({ id: id }), function(err, result) {
                    if (err){
                        callback(err,undefined);
                        pool.release(c);
                        return;
                    }
                    if (result.info.numRows != 0) {
                        result[0]['status'] = 's';
                        if (id=='0316201'||id=='0316201'||id=='0312512'||id=='0416014'||id=='0416008'||id=='0416081'||id=='0516003'||id=='0516205')
                            result[0]['status'] = 'w';
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                })
            });
        } else if (id.match(/^T.*/g)) {
            const resource = pool.acquire();
            resource.then(function(c) {
                var sql_findProfessor = c.prepare(s.findProfessor);
                c.query(sql_findProfessor({ id: id }), function(err, result) {
                    if (err){
                        callback(err,undefined);
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
                        callback(err,undefined);
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
                    callback(err,undefined);
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
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    },
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
    totalCredit: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_totalCredit = c.prepare(s.totalCredit);
            c.query(sql_totalCredit({ id: id }), function(err, result) {
                if (err){
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
    },
    Pass: function(id,callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_Pass = c.prepare(s.Pass);
            var year = '1' + id[0] + id[1];
            c.query(sql_Pass({ id: id, year: year }), function(err, result) {
                if (err){
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
    },
    PassSpecify: function(id,category,callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_PassSpecify = c.prepare(s.PassSpecify);
            var year = '1' + id[0] + id[1];
            c.query(sql_PassSpecify({id,year,category}), function(err, result) {
                if (err){
                    callback(err,undefined);
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
                    callback(err,undefined);
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
                    callback(err,undefined);
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
            var sql_studentGraduateList = c.prepare(s.studentGraduateList);
            var sem = id[0] + id[1];
            c.query(sql_studentGraduateList({ sem: sem }), function(err, result) {
                if (err){
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })
        })
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
                        callback(err,undefined);
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
                        callback(err,undefined);
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
                    callback(err,undefined);
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
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
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
    insertCosMotion: function(id,name,orig,now){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_insertCosMotion=c.prepare(s.insertCosMotion);
            c.query(sql_insertCosMotion({id:id,name:name,orig:orig,now:now}),function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    },
    cosMotion: function(id,callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_cosMotion=c.prepare(s.cosMotion);
            c.query(sql_cosMotion({id:id}),function(err,result){
                if (err){
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null,JSON.stringify(result));
                pool.release(c);
            });
        });
    },
    cosMotionDelete:function(id){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_cosMotionDelete=c.prepare(s.cosMotionDelete);
            c.query(sql_cosMotionDelete({id:id}),function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    },
    qaInsert:function(que,ans,callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_qaInsert=c.prepare(s.qaInsert);
            var sql_qaMaxId=c.prepare(s.qaMaxId);
            c.query(sql_qaMaxId({}),function(err,result){
                if (err){
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                var id=0;
                if(result[0]['maxID']!=null)
                    id=parseInt(result[0]['maxID'])+1;
                c.query(sql_qaInsert({id:id,que:que,ans:ans}),function(err,result){
                    if (err){
                        callback(err,undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null,JSON.stringify(result));
                    pool.release(c);
                });
            });
        });
    },
    qaDelete:function(id,callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_qaDelete=c.prepare(s.qaDelete);
            c.query(sql_qaDelete({id:id}),function(err){
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
            c.query(sql_qaSearch({}),function(err,result){
                if (err){
                    callback(err,undefined);
                    pool.release(c);
                    return;
                }
                callback(null,JSON.stringify(result));
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
                    callback(err,undefined);
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
                    callback(err,undefined);
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
    getRecommend:function(id,callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var semester='106-2%';
            var sql_getRecommend=c.prepare(s.getRecommend);
            var sql_findCurrentCos=c.prepare(s.findCurrentCos);
            var sql_findTeacher=c.prepare(s.findTeacher);
            var result=[];
            c.query(sql_getRecommend({id:id}),function(err,reclist){
                c.query(sql_findCurrentCos({semester}),function(err,cos){
                    c.query(sql_findTeacher({}),function(err,tea){
                        //select all recommend cos to variable rec
                        reclist=reclist[0]['cos_name_list'];
                        let rec=reclist.split(",");

                        cos=JSON.parse(JSON.stringify(cos));
                        tea=JSON.parse(JSON.stringify(tea));

                        for(let i=0;i<rec.length;i++){
                            //select all cos info into variable data
                            let data=cos.filter(function(c){return parseEng(c.cos_cname)===rec[i]});
                            
                            //for every cos data
                            for(let d_num=0;d_num<data.length;d_num++)
                            {
                                //select all teacher who teach the recommend cos
                                var tea_list=data[d_num]['teacher_id'].split(",");

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
                                data[d_num]['teacher']=tea_list.join(',');
                                data[d_num]['cos_time']=data[d_num]['cos_time'].split('-')[0];
                                
                                result.push(data[d_num]);
                            }
                        }

                        pool.release(c);
                        callback(null,JSON.stringify(result));
                    });
                });
            });
        });
    },
    Drain: function() {
        pool.drain().then(function() {
            pool.clear();
        });
    }
};