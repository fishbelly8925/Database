var CONST = require('../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./teacher_sqlString.js');

var pool = psw.dbpsw();

module.exports = {
	ShowTeacherCosNow:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherCosNow = c.prepare(s.ShowTeacherCosNow);
            c.query(sql_ShowTeacherCosNow({id: id}), function(err, result){
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
    ShowTeacherCosAll:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherCosAll = c.prepare(s.ShowTeacherCosAll);
            c.query(sql_ShowTeacherCosAll({id: id}), function(err, result){
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
    ShowTeacherMentors:function(id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherMentors = c.prepare(s.ShowTeacherMentors);
            c.query(sql_ShowTeacherMentors({id:id}), function(err, result){
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
    ShowTeacherIdList:function(callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowTeacherIdList = c.prepare(s.ShowTeacherIdList);
            c.query(sql_ShowTeacherIdList({}), function(err, result){
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