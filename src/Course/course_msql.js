var CONST = require('../constant.js')

var s = require('./course_sqlString.js');
var psw = require(CONST.FILE_PATH);
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

function parseHonor(cos){
    if(cos.indexOf('榮譽班')>-1)
        cos=cos.substring(0, cos.length-3);
    return cos
}

module.exports = {
	ShowCosScoreDetail: function(cos_code, unique_id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowCosScoreDetail = c.prepare(s.ShowCosScoreDetail);
            c.query(sql_ShowCosScoreDetail({cos_code: cos_code, unique_id: unique_id}), function(err, result){
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
    ShowCosScoreInterval: function(cos_code, unique_id, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowCosScoreInterval = c.prepare(s.ShowCosScoreInterval);
            c.query(sql_ShowCosScoreInterval({cos_code: cos_code, unique_id: unique_id}), function(err, result){
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
    ShowCosMotionLocate: function(id, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowCosMotionLocate=c.prepare(s.ShowCosMotionLocate);
            c.query(sql_ShowCosMotionLocate({id:id}), function(err, result){
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
    ShowCosMapRule: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowCosMapRule = c.prepare(s.ShowCosMapRule);
            var year = '1' + id[0] + id[1];
            c.query(sql_ShowCosMapRule({ id: id, year: year }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        })
    },
    ShowCosMapPass: function(id, callback) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_ShowCosMapPass = c.prepare(s.ShowCosMapPass);
            c.query(sql_ShowCosMapPass({ id: id }), function(err, result) {
                if (err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                for(var i in result){
                    if(result[i]['cos_cname']==='微積分Ａ（一）' || result[i]['cos_cname']==='微積分Ｂ（一）' || result[i]['cos_cname']==='微積分甲（一）')
                        result[i]['cos_cname']='微積分(一)';
                    else if(result[i]['cos_cname']==='微積分Ａ（二）' || result[i]['cos_cname']==='微積分Ｂ（二）' || result[i]['cos_cname']==='微積分甲（二）')
                        result[i]['cos_cname']='微積分(二)';
                    if(typeof(result[i]['cos_cname'])==='string')
                        result[i]['cos_cname']=parseHonor(parseEng(result[i]['cos_cname']));
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });
        });
    },
    ShowCosMapIntro:function(cos_cname, callback){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_ShowCosMapIntro = c.prepare(s.ShowCosMapIntro);
            c.query(sql_ShowCosMapIntro({cos_cname: cos_cname}), function(err, result){
                if(err){
                    callback(err, undefined);
                    pool.release(c);
                    return;
                }
                // if one course has many teachers 
                for(let i = 0; i < result.length; i++){
                    let j = 0;
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
    SetCosMotion: function(id, name, orig, now){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetCosMotion = c.prepare(s.SetCosMotion);
            c.query(sql_SetCosMotion({id:id, name:name, orig:orig, now:now}), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    },
    DeleteCosMotion:function(id){
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_DeleteCosMotion = c.prepare(s.DeleteCosMotion);
            c.query(sql_DeleteCosMotion({id:id}), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }
}