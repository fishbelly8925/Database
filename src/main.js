// 使用前請先
// npm install mariasql
// npm install line-reader
// npm install generic-pool

var m = require('./msql.js');

m.findPerson('0516003', function(err, result) {
    if (err)
        throw err;
    console.log(JSON.parse(result));
}); // findPerson 回傳學生資料

m.addEmail('0516003', 'ddddt@test');
// addEmail(學號,email) 更新此學號學生之email

m.showCosMap('0516003', function(err, result) {
    if (err)
        throw err;
    console.log(JSON.parse(result));
}); // showCosMap 課程地圖要顯示的項目以及建議先修課與擋修課程

m.showCosMapPass('0516003', function(err, result) {
    if (err)
        throw err;
    console.log(JSON.parse(result));
}); // showCosMapPass 某學生在課程地圖上有通過的課

m.totalCredit('0516003', function(err, result) {
    if (err)
        throw err;
    console.log(JSON.parse(result));
}); // totalCredit 回傳某學生總學分數

m.Pass('0516003', function(err, result) {
    if (err)
        throw err;
    console.log(JSON.parse(result));
}); // Pass 列出此學生通過的課

m.Group('0516003',function(err,result){
	if(err)
		throw err;
	console.log(JSON.parse(result));
}); // Group 列出此學生畢業預審表上 必修、核心、副核心等課程分類

m.graduateRule('0316003',function(err,result){
	if(err)
		throw err;
	console.log(JSON.parse(result));
}); // graduateRule 列出此學生畢業標準

m.studentGraduateList('05',function(err,result){
	if(err)
		throw err;
	console.log(JSON.parse(result));
}); // studentGraduateList 列出此學號開頭的學生的畢業資訊（助理端用）

m.setStudentGraduate('0516003',0);
// setStudentGraduate 設定某學生的畢業狀態(1可畢業,0不可畢業)（助理端用）

m.setStudentGraduateSubmit('0516003','1');
// setStudentGraduate 設定某學生的畢業預審確認狀態(1可畢業,0不可畢業)

m.bindAccount('0516003','test@gmail.com.tw','3');
// bindAccount   1:set gmail   2:set fb_id   3:set github_id

m.Drain(); // 關閉 connection pool