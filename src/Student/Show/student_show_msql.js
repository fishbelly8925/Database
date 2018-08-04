var CONST = require('../../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./student_show_sqlString.js');

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
	ShowUserInfo: function(id, callback) {
        if (id.match(/^[0-9].*/g)) {
            const resource = pool.acquire();
            resource.then(function(c) {
                var sql_findStudent = c.prepare(s.findStudent);
                var sql_findCrossStudent = c.prepare(s.findCrossStudent);
                var sql_findStudentFailed = c.prepare(s.findStudentFailed);
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
                        c.query(sql_findStudentFailed({id}), function(err, failed){
                            c.query(sql_findStudent({id}), function(err, result) {
                                if(err){
                                    callback(err, undefined);
                                    pool.release(c);
                                    return;
                                }
                                result[0]['failed'] = 'not_failed';
                                for(let i in failed)
                                    if(failed[i]['failed'] == 'failed'){
                                        result[0]['failed'] = 'failed';
                                        break;
                                    }
                                if(result.info.numRows != 0){
                                    result[0]['status'] = 's';
                                    if (id=='0316201'||id=='0312512'||id=='0416014'||id=='0416008'||id=='0416081'||id=='0516003'||id=='0516205')
                                        result[0]['status'] = 'w';
                                }
                                callback(null, JSON.stringify(result));
                                pool.release(c);
                            })
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
    ShowUserAllScore: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowUserAllScore = c.prepare(s.ShowUserAllScore);
            var year = '1' + id[0] + id[1];
            c.query(sql_ShowUserAllScore({ id: id, year: year }), function(err, result) {
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
    ShowUserPartScore: function(id, category, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_PassSpecify = c.prepare(s.ShowUserPartScore);
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
    // general_cos_rule: function(callback) {
    //     const resource = pool.acquire();
    //     resource.then(function(c) {
    //         var sql_general_cos_rule = c.prepare(s.general_cos_rule);
    //         c.query(sql_general_cos_rule({}), function(err, result) {
    //             if (err){
    //                 callback(err, undefined);
    //                 pool.release(c);
    //                 return;
    //             }
    //             callback(null, JSON.stringify(result));
    //             pool.release(c);
    //         });
    //     });
    // },
    ShowRecommendCos:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var semester = '106-2%';
            var sql_ShowRecommendCos = c.prepare(s.ShowRecommendCos);
            var sql_findCurrentCos = c.prepare(s.findCurrentCos);
            var sql_findTeacher = c.prepare(s.findTeacher);
            var result = [];
            c.query(sql_ShowRecommendCos({id}), function(err, reclist){
                c.query(sql_findCurrentCos({semester}), function(err, cos){
                    c.query(sql_findTeacher({}), function(err, tea){
                        //select all recommend cos to variable rec
                        if(reclist.length == 0)
                        {
                            pool.release(c);
                            callback(null, JSON.stringify([]));
                            return;
                        }
                        reclist = reclist[0]['cos_name_list'];
                        let rec = reclist.split(",");

                        cos = JSON.parse(JSON.stringify(cos));
                        tea = JSON.parse(JSON.stringify(tea));

                        for(let i = 0;i<rec.length;i++){
                            //select all cos info into variable data
                            let data = cos.filter(function(c){return parseEng(c.cos_cname)===rec[i]});
                            
                            //for every cos data
                            for(let d_num = 0;d_num<data.length;d_num++)
                            {
                                //select all teacher who teach the recommend cos
                                var tea_list = data[d_num]['teacher_id'].split(",");

                                //for every teacher
                                for(let k = 0;k<tea_list.length;k++)
                                    //iterate all teacher list 
                                    for(let j=0;j<tea.length;j++)
                                        //select the teacher name
                                        if(tea_list[k].indexOf(tea[j]['teacher_id'])>-1)
                                        {
                                            tea_list[k] = tea[j]['tname'];
                                            break
                                        }
                                delete data[d_num]['teacher_id'];
                                data[d_num]['teacher'] = tea_list.join(',');
                                data[d_num]['cos_time'] = data[d_num]['cos_time'].split('-')[0];
                                
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
    ShowStudentIdList:function(callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowStudentIdList = c.prepare(s.ShowStudentIdList);
            c.query(sql_ShowStudentIdList({}), function(err, result){
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
    ShowStudentMentor:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowStudentMentor = c.prepare(s.ShowStudentMentor);
            c.query(sql_ShowStudentMentor({id}), function(err, result){
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
    ShowUserOnCos: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowUserOnCos = c.prepare(s.ShowUserOnCos);
            c.query(sql_ShowUserOnCos({ id: id }), function(err, result) {
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
    ShowUserOffset: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c){
            if (id != 'all') {
                var sql_ShowUserOffset = c.prepare(s.ShowUserOffsetSingle);
                c.query(sql_ShowUserOffset({ id: id }), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            } else {
                var sql_ShowUserOffset = c.prepare(s.ShowUserOffsetAll);
                c.query(sql_ShowUserOffset({}), function(err, result) {
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
    ShowGraduateStudentList: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c){
            if( id != 'all'){
                var sql_ShowGraduateStudentListSingle = c.prepare(s.ShowGraduateStudentListSingle);
                var sem = id[0] + id[1];
                c.query(sql_ShowGraduateStudentListSingle({ sem: sem }), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                })
            } else{
                var sql_ShowGraduateStudentListAll = c.prepare(s.ShowGraduateStudentListAll);
                c.query(sql_ShowGraduateStudentListAll({}), function(err, result) {
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
    ShowGraduateRule: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowGraduateRule = c.prepare(s.ShowGraduateRule);
            var year = '1' + id[0] + id[1];
            c.query(sql_ShowGraduateRule({ id: id, year: year }), function(err, result) {
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
    ShowUserTotalCredit: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowUserTotalCredit = c.prepare(s.ShowUserTotalCredit);
            c.query(sql_ShowUserTotalCredit({ id: id }), function(err, result) {
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
    ShowCosGroup: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowCosGroup = c.prepare(s.ShowCosGroup);
            var year = '1' + id[0] + id[1];
            c.query(sql_ShowCosGroup({ id: id, year: year }), function(err, result) {
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
    ShowSemesterScore: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowCosScore = c.prepare(s.ShowCosScore);
            var sql_ShowSemesterScore = c.prepare(s.ShowSemesterScore);
            c.query(sql_ShowSemesterScore({id}), function(err, result) {
                c.query(sql_ShowCosScore({id}), function(err, cos){
                
                result = JSON.parse(JSON.stringify(result));
                cos = JSON.parse(JSON.stringify(cos));
                var score = JSON.parse(JSON.stringify(cos,["cn","en","score","pass"]));

                for(let sem_num = 0;sem_num<result.length;sem_num++){
                    result[sem_num]["score"]=[];
                    for(let cos_num = 0;cos_num<cos.length;cos_num++){
                        if(result[sem_num].semester===cos[cos_num].semester){
                            result[sem_num]["score"].push(score[cos_num]);
                        }
                    }
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
                })
            })
        })
    }
}