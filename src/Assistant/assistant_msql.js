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
    SetGraduateSubmitStatus:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetGraduateSubmitStatus=c.prepare(s.SetGraduateSubmitStatus);
            c.query(sql_SetGraduateSubmitStatus(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c); 
                    throw err;
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