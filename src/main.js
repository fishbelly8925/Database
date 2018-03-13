// 使用前請先
// npm install mariasql
// npm install generic-pool

var m = require('./msql.js');

// m.findPerson('0516205', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // findPerson 回傳學生資料

// m.addEmail('0516003', 'dabct@test');
// // addEmail(學號,email) 更新此學號學生之email

// m.showCosMap('0316003', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // showCosMap 課程地圖要顯示的項目以及建議先修課與擋修課程

// m.showCosMapPass('0316248', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // showCosMapPass 某學生在課程地圖上有通過的課

// m.totalCredit('0516003', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // totalCredit 回傳某學生總學分數

// m.Pass('0316091', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // Pass 列出此學生通過的課

// m.PassSpecify('0516003','通識',function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // PassSpecify 列出此學生某向度中通過的課

// m.Group('0516003',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // Group 列出此學生畢業預審表上 必修、核心、副核心等課程分類

// m.graduateRule('0516003',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // graduateRule 列出此學生畢業標準

// m.offset('all',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // offset 個人抵免資料 (輸入all顯示全部)

// m.on_cos_data('0316067',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // on_cos_data 大四個人當期修課資料 (輸入all顯示全部)

// m.general_cos_rule(function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // general_cos_rule 外系通識規則

// m.studentGraduateList('05',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // studentGraduateList 列出此學號開頭的學生的畢業資訊（助理端用）

// m.setEnCertificate('0516003',0);
// // setEnCertificate 設定某學生的英檢狀態

// m.setStudentGraduate('0516003',0);
// // setStudentGraduate 設定某學生的畢業狀態(1可畢業,0不可畢業)（助理端用）

// m.setStudentGraduateSubmit('0516003',1);
// // setStudentGraduate 設定某學生的畢業預審確認狀態(1可畢業,0不可畢業)

// m.bindAccount('0516003','test@gmail.com.tw',1);
// // bindAccount   1:set gmail   2:set fb_id   3:set github_id

// m.insertCosMotion('0516003','test2','a','c');
// // insertCosMotion(id,cos_name,original position,now position) 更新課程位置

// m.cosMotion('0516003',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // cosMotion(id,callback) 回傳學生修改課程位置

// m.cosMotionDelete('0516003');
// // cosMotionDelete(id) 刪除學生課程位置紀錄

// m.qaInsert('aaa','bbb',function(err){
// 	if(err)
// 		throw err;
// });
// // qaInsert(question,answer,callback) 新增問答

// m.qaSearch(function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(result);
// });
// //qaSearch(callback) 回傳所有問答

// m.qaDelete(0,function(err){
// 	if(err)
// 		throw err;
// });
// // qaDelete(id,callback) 刪除編號id的紀錄

/// m.teacherCosNow('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // teacherCosNow(id, callback) 某老師當學期開課

// m.teacherCosAll('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // teacherCosNow(id, callback) 某老師所有開過的課

// m.teacherStudents('T9229',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // teacherStudents(id,callback) 某老師導生名單

// m.showCosMapIntro('訊號與系統', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // showCosMapIntro(cos_cname, callback) 課程地圖某堂課的資訊

// m.showCosScoreDetail('DCP3595', '105-2-1191', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // showCosScoreDetail(cos_code, unique_id, callback) 某堂課的成績詳細資料

// m.showCosScoreInterval('DCP3595', '105-2-1191', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // showCosScoreInterval(cos_code, unique_id, callback) 某堂課的成績區間人數

// m.getRecommend('0616008',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // getRecomend(student_id,callback) 回傳某學生的推薦課程

m.findTeacherInfo('邱維辰',function(err,result){
	if(err)
		throw err;
	console.log(JSON.parse(result));
}); // findTeacherInfo(tname, callback) 回傳某教授info

m.Drain(); // 關閉 connection pool