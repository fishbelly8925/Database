var CONST = require('../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./qa_sqlString.js');

var pool = psw.dbpsw();

module.exports = { 
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
    }
};