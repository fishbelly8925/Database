var CONST = require('../../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./student_update_sqlString.js');

var pool = psw.dbpsw();

module.exports = {
	SetUserEmail: function(id, email) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_SetUserEmail = c.prepare(s.SetUserEmail);
            c.query(sql_SetUserEmail({ id: id, email: email }), function(err) {
                if (err)
                    throw err;
                pool.release(c);
            });
        })
    },
    SetUserOAuth: function(id, str, type) {
        const resource = pool.acquire();
        resource.then(function(c) {
            var sql_setGmail = c.prepare(s.setGmail);
            var sql_setFbId = c.prepare(s.setFbId);
            var sql_setGithubId = c.prepare(s.setGithubId);
            if (type === 1)
                c.query(sql_setGmail({ id: id, gmail: str }), function(err, result) {
                    if (err)
                        throw err;
                    pool.release(c);
                });
            else if (type === 2)
                c.query(sql_setFbId({ id: id, fb_id: str }), function(err, result) {
                    if (err)
                        throw err;
                    pool.release(c);
                });
            else if (type === 3)
                c.query(sql_setGithubId({ id: id, github_id: str }), function(err, result) {
                    if (err)
                        throw err;
                    pool.release(c);
                });
        });
    }
}