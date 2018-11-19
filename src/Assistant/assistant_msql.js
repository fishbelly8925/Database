var CONST = require('../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./assistant_sqlString.js');

var pool = psw.dbpsw();

module.exports = { 
    SetEnCertificate: function(id, check) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_SetEnCertificate = c.prepare(s.SetEnCertificate);
            c.query(sql_SetEnCertificate({ id: id, check: check }), function(err,result) {
                if (err)
                    throw err;
                console.log(id,check);
                console.log(result);
                pool.release(c);
            });
        });
    }, 
    SetGraduateSubmitStatus:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetGraduateSubmitStatus=c.prepare(s.SetGraduateSubmitStatus);
            var sql_SetNetMediaStatus=c.prepare(s.SetNetMediaStatus);
            var sql_SetSubmitTypeStatus=c.prepare(s.SetSubmitTypeStatus);
            c.query(sql_SetGraduateSubmitStatus(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c); 
                    throw err;
                }
                if(data['submit_type']==0 || data['submit_type']==1 || data['submit_type'] == 3){
                    c.query(sql_SetSubmitTypeStatus(data), function(err, result){
                        if(err)
                        {
                            callback(err, undefined);
                            pool.release(c); 
                            throw err;
                        }
                    })
                }
                if(data['net_media']==0 || data['net_media']==1){
                    c.query(sql_SetNetMediaStatus(data), function(err, result){
                        if(err)
                        {
                            callback(err, undefined);
                            pool.release(c); 
                            throw err;
                        }
                    })
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