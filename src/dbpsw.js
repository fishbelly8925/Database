var Client = require('mariasql');
var genericPool = require('generic-pool');

const factory = {
    name: 'mariadb',
    create: function() {
        return new Promise(function(resolve, reject) {
            var c = new Client({
                host: 'localhost',
                user: 'root',
                password: '',
                db: 'test',
                charset: 'utf8'
            });
            c.connect();
            c.on('ready', function() {
                resolve(c);
            });
        });
    },
    destroy: function(client) {
        client.end();
    }
};

var opts = {
    max: 30,
    min: 2
};

var pool = genericPool.createPool(factory, opts);

module.exports.dbpsw = function(){

  return pool;

};

