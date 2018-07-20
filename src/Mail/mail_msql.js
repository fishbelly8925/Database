var CONST = require('../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./mail_sqlString.js');

var pool = psw.dbpsw();

module.exports = { 
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
    }
};