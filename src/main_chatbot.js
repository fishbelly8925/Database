// 使用前請先
// npm install mariasql
// npm install generic-pool

var m = require('./msql.js');

m.ShowUserDefined('all',function(err, result){
    if(err)
        throw err;
    console.log(JSON.parse(result));
}); // ShowAllUserDefined 列出所有自定義 (輸入all顯示全部)

m.Drain(); // 關閉 connection pool