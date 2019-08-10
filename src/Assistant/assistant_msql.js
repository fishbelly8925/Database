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
                if(data['net_media']==0 || data['net_media']==1 || data['net_media'] == 2 || data['net_media'] == 3){
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
    CreateApplyPeriod: function(data, callback){
        const resource=pool.acquire();
        resource.then(function(c) {
            var sql_CreateApplyPeriod = c.prepare(s.CreateApplyPeriod);
            c.query(sql_CreateApplyPeriod(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })  
        })
    },
    SetApplyPeriod: function(data, callback){
        const resource=pool.acquire();
        resource.then(function(c) {
            var sql_SetApplyPeriod = c.prepare(s.SetApplyPeriod);
            c.query(sql_SetApplyPeriod(data), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            })  
        })
    },
    ShowApplyPeriod: function(data, callback){
        var period = {offset:{begin:null,end:null},research:{begin:null,end:null},graduation:{begin:null,end:null}}
        const resource=pool.acquire();
        resource.then(function(c) {
            var sql_ShowApplyPeriod = c.prepare(s.ShowApplyPeriod);
                c.query(sql_ShowApplyPeriod(data), function(err, result){
                    if(err)
                    {
                        callback(err, undefined);
                        pool.release(c);
                        return ;
                    }
                    result=JSON.parse(JSON.stringify(result));
                    for(i in result){
                        type = result[i]["type"]
                        if(period.hasOwnProperty(type)){
                            period[type]["begin"] = result[i]["begin"]
                            period[type]["end"] = result[i]["end"]
                        }
                    }
                    callback(null, JSON.stringify(period));
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