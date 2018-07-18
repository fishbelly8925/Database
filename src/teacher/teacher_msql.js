var s = require('./teacher_sqlString.js');
var psw = require('../dbpsw.js');

var pool = psw.dbpsw();

module.exports = {
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
    }
}