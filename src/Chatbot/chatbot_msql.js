var CONST = require('../constant.js')

var psw = require(CONST.FILE_PATH);
var s = require('./chatbot_sqlString.js');

var pool = psw.dbpsw();

module.exports = {
    ShowUserDefined: function(defined_word, callback) {
        const resource = pool.acquire();
        if(defined_word == 'all')
            resource.then(function(c){
                var sql_ShowUserDefined_all = c.prepare(s.ShowUserDefined_all);
                c.query(sql_ShowUserDefined_all({}), function(err, result) {
                    if (err){
                        callback(err, undefined);
                        pool.release(c);
                        return;
                    }
                    callback(null, JSON.stringify(result));
                    pool.release(c);
                });
            });
        else
            resource.then(function(c){
                var sql_ShowUserDefined_single = c.prepare(s.ShowUserDefined_single);
                c.query(sql_ShowUserDefined_single({ defined_word: defined_word }), function(err, result) {
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
}