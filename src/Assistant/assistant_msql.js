var CONST = require('../constant.js');

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
            var sql_SetRejectReason=c.prepare(s.SetRejectReason);
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
                if(data['graduate_submit'] == 3){
                    c.query(sql_SetRejectReason(data), function(err, result){
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
                    var i
                    result=JSON.parse(JSON.stringify(result));
                    if(result == '')
                        callback(null, JSON.stringify(result));
                    else
                    {
                        for(i in result){
                            type = result[i]["type"]
                            if(period.hasOwnProperty(type)){
                                period[type]["begin"] = result[i]["begin"]
                                period[type]["end"] = result[i]["end"]
                            }
                        }
                        callback(null, JSON.stringify(period));
                    }
                    
                    pool.release(c);
                });  
        });
    },
    InsertNewData: function(data){
        // data => {file_name: 'yoyoabc.csv', data_type: "課程成績資料", semester: '108-2'}
        // "課程成績資料" => "cos_score"
        // "新老師資料"   => "new_teacher_info"
        // "學生資料"    => "student"
        // "抵免免修資料"    => "offset"
        // "英文換修資料" => "en_certificate"
        var type_mapping = {
            "課程成績資料": "cos_score",
            "新老師資料": "new_teacher_info",
            // "當期修課資料": "on_cos_data",
            "學生資料": "student",
            "抵免免修資料": "offset",
            "英文換修資料":"en_certificate"
        }

        let exec_sync = require('child_process').execSync;
        let exec = require('child_process').exec;


        let data_path_base = '/home/nctuca/dinodino-extension/automation/data/'
        let program_path = '/home/nctuca/dinodino-extension/automation/'
        // let data_path_base = '/home/karljackab/'
        // let program_path = '/home/karljackab/Database/python/automation/'
        let convertProgram = 'checkFile.py'

        var program_name = 'insert_'+type_mapping[data['data_type']]+'.py';
        var data_path = data_path_base+data['semester']+'-'+type_mapping[data['data_type']]+'.csv';

        let convart_file_name = data_path_base+data['semester']+'-'+data['data_type']+'.xlsx'

        if(data_path_base+data['file_name'] != convart_file_name)
            exec_sync('cp '+data_path_base+data['file_name']+' '+convart_file_name)
       
        exec('python3 '+program_path+convertProgram+' '+convart_file_name+' '+data_path, function(error, stdout, stderr) {
            if(error == null)
            {
                exec('python3 '+program_path+program_name+' '+data_path);
                if(data['data_type'] == '課程成績資料')
                {
                    program_name = 'insert_on_cos_data.py';
                    data_path_base+data['semester']+'-on_cos_data.csv';
                    exec('python3 '+program_path+program_name+' '+data_path);
                }
            }
        });
    },
    ShowAllDataLog: function(callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_ShowAllDataLog = c.prepare(s.ShowAllDataLog);
            c.query(sql_ShowAllDataLog({}), function(err, result){
                if(err)
                {
                    callback(err, undefined);
                    pool.release(c);
                    return ;
                }
                callback(null, JSON.stringify(result));
                pool.release(c);
            });  
        });
    },
    DeleteDataLog: function(data, callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_DeleteDataLog = c.prepare(s.DeleteDataLog);
            c.query(sql_DeleteDataLog(data), function(err, result){
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
    DeleteAllDataLog: function(callback){
        const resource = pool.acquire();
        resource.then(function(c){
            var sql_DeleteAllDataLog = c.prepare(s.DeleteAllDataLog);
            c.query(sql_DeleteAllDataLog({}), function(err, result){
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
    Drain: function() {
        pool.drain().then(function() {
            pool.clear();
        });
    }
};