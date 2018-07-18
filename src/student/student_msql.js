var s = require('./student_sqlString.js');
var psw = require('../dbpsw');

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
    getRecommend:function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var semester='106-2%';
            var sql_getRecommend=c.prepare(s.getRecommend);
            var sql_findCurrentCos=c.prepare(s.findCurrentCos);
            var sql_findTeacher=c.prepare(s.findTeacher);
            var result=[];
            c.query(sql_getRecommend({id}), function(err, reclist){
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
    mentorReturn:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_mentorReturn = c.prepare(s.mentorReturn);
            c.query(sql_mentorReturn({id}), function(err, result){
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
    }
}