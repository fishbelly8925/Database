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
        // "當期修課資料" => "on_cos_data"
        // "學生資料"    => "student"

        let exec = require('child_process').execSync;
        let data_path_base = '/home/nctuca/dinodino-extension/automation/data/'
        let program_path = '/home/nctuca/dinodino-extension/automation/'
        // let data_path_base = '/home/karljackab/'
        // let program_path = '/home/karljackab/Database/python/automation/'
        let convertProgram = 'checkFile.py'
        let sub_data_name = 'csv'
        if(data['data_type'] == '課程成績資料')
        {
            var program_name = 'insert_cos_score.py';
            var data_path = data_path_base+data['semester']+'-cos_score.'+sub_data_name;
            if(data_path_base+data['file_name'] != data_path)
                exec('python3 '+program_path+convertProgram+' '+data_path_base+data['file_name']+' '+data_path);
        }
        else if(data['data_type'] == '新老師資料')
        {
            var program_name = 'insert_new_teacher_info.py';
            var data_path = data_path_base+data['semester']+'-new_teacher_info.'+sub_data_name;
            if(data_path_base+data['file_name'] != data_path)
            exec('python3 '+program_path+convertProgram+' '+data_path_base+data['file_name']+' '+data_path);
        }
        else if(data['data_type'] == '當期修課資料')
        {
            var program_name = 'insert_on_cos_data.py';
            var data_path = data_path_base+data['semester']+'-on_cos_data.'+sub_data_name;
            if(data_path_base+data['file_name'] != data_path)
            exec('python3 '+program_path+convertProgram+' '+data_path_base+data['file_name']+' '+data_path);
        }
        else if(data['data_type'] == '學生資料')
        {
            var program_name = 'insert_student.py';
            var data_path = data_path_base+data['semester']+'-student.'+sub_data_name;
            if(data_path_base+data['file_name'] != data_path)
            exec('python3 '+program_path+convertProgram+' '+data_path_base+data['file_name']+' '+data_path);
        }
        // console.log('python3 '+program_path+program_name+' '+data_path)
        exec('python3 '+program_path+program_name+' '+data_path);
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
                // console.log(result);
                for(let i=0; i<result.length; i+=1)
                {
                    if(result[i]['calling_file'] == 'insert_cos_score.py')
                        result[i]['data_type'] = '課程成績資料'
                    else if(result[i]['calling_file'] == 'insert_new_teacher_info.py')
                        result[i]['data_type'] = '新老師資料'
                    else if(result[i]['calling_file'] == 'insert_on_cos_data.py')
                        result[i]['data_type'] = '當期修課資料'
                    else if(result[i]['calling_file'] == 'insert_student.py')
                        result[i]['data_type'] = '學生資料' 
                    delete result[i]['calling_file']
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