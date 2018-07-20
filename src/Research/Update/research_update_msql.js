var CONST = require('../../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./research_update_sqlString.js');

var pool = psw.dbpsw();

module.exports = { 
    SetResearchInfo:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_setResearchTitle=c.prepare(s.setResearchTitle);
            var sql_setResearchLink=c.prepare(s.setResearchLink);
            var sql_setResearchIntro=c.prepare(s.setResearchIntro);

            c.query(sql_setResearchTitle({research_title: data['research_title'], tname: data['tname'], first_second:data['first_second'], semester:data['semester'], new_title: data['new_title']}), function(err, result){
                if(err)
                    throw err;
                c.query(sql_setResearchLink({research_title: data['new_title'], tname: data['tname'], first_second:data['first_second'], semester:data['semester'], new_link: data['new_link']}), function(err, result){
                    if(err)
                        throw err;
                    c.query(sql_setResearchIntro({research_title: data['new_title'], tname: data['tname'], first_second:data['first_second'], semester:data['semester'], new_intro: data['new_intro']}), function(err, result){
                        if(err)
                            throw err;
                        pool.release(c);    
                    });
                });
            });
        });
    }, 
    SetResearchScoreComment:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_setResearchScore=c.prepare(s.setResearchScore);
            var sql_setResearchComment=c.prepare(s.setResearchComment);
            c.query(sql_setResearchScore(data), function(err){
                if(err)
                {
                    throw err;
                }
            });
            c.query(sql_setResearchComment(data), function(err){
                if(err)
                {
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    CreateNewResearch:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_CreateNewResearch=c.prepare(s.CreateNewResearch);
            c.query(sql_CreateNewResearch(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    SetResearchTitle:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetResearchTitle=c.prepare(s.SetResearchTitle);
            c.query(sql_SetResearchTitle(data), function(err){
                if(err)
                    throw err;
                pool.release(c);
            });
        });
    }, 
    CreateResearchFile:function(data){
        if(typeof(data) === 'string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_CreateResearchFile=c.prepare(s.CreateResearchFile);
            c.query(sql_CreateResearchFile(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    CreateResearchApplyForm:function(data, callback){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_AddPhone=c.prepare(s.AddPhone);
            var sql_CreateResearchApplyForm=c.prepare(s.CreateResearchApplyForm);
            var sql_AddEmail=c.prepare(s.AddEmail);
            c.query(sql_AddPhone({student_id:data['student_id'], phone:data['phone']}), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                c.query(sql_AddEmail({id:data['student_id'], email:data['email']}), function(err){
                    if(err)
                    {
                        pool.release(c);
                        throw err;
                    }
                    c.query(sql_CreateResearchApplyForm(data), function(err){
                        if(err)
                        {
                            pool.release(c);
                            throw err;
                        }
                        pool.release(c);
                    });
                });
            });
        });
    }, 
    SetResearchApplyFormStatus:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_SetResearchApplyFormStatus=c.prepare(s.SetResearchApplyFormStatus);
            c.query(sql_SetResearchApplyFormStatus(data), function(err, result){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }, 
    DeleteResearchApplyForm:function(data){
        if(typeof(data)==='string')
            data=JSON.parse(data);
        const resource=pool.acquire();
        resource.then(function(c){
            var sql_DeleteResearchApplyForm=c.prepare(s.DeleteResearchApplyForm);
            c.query(sql_DeleteResearchApplyForm(data), function(err){
                if(err)
                {
                    pool.release(c);
                    throw err;
                }
                pool.release(c);
            });
        });
    }
};