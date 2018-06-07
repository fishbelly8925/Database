// 使用前請先
// npm install mariasql
// npm install generic-pool

var m = require('./msql.js');

// m.findPerson('T9229', function(err, result) {
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

// m.showCosMapPass('0312512', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // showCosMapPass 某學生在課程地圖上有通過的課

// m.totalCredit('0516003', function(err, result) {
//     if (err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // totalCredit 回傳某學生總學分數

// m.Pass('0516069', function(err, result) {
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
// }); // studentGraduateList 列出此學號開頭的學生的畢業資訊(輸入all顯示全部)(助理端用)

// m.setEnCertificate('0516003',0);
// // setEnCertificate 設定某學生的英檢狀態

// m.setStudentGraduate('0516003',0);
// // setStudentGraduate 設定某學生的畢業狀態(1可畢業,0不可畢業)（助理端用）

// m.setStudentGraduateSubmit('0516003',1);
// // setStudentGraduateSubmit 設定某學生的畢業預審確認狀態(1可畢業,0不可畢業)

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

// m.teacherCosNow('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // teacherCosNow(id, callback) 某老師當學期開課

// m.teacherCosAll('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // teacherCosAll(id, callback) 某老師所有開過的課

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

// m.findTeacherInfo('T9229',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // findTeacherInfo(tname, callback) 回傳某教授info

// m.findTeacherResearch('T9410',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // findTeacherResearch(teacher_id, callback) 回傳某教授所有專題生和專題題目

// m.findTeacherResearchCount(function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result)[9]);
// }); // findTeacherResearchCount(callback) 回傳所有教授各屆的學生人數

// m.mailCreate({sender_id:'0516003',title:'test~~',receiver_id:'T9229',content:'這是一個測試信件這是一個測試信件'});
// // mailCreate(data) data type 為JSON，新增一則信件，需有以上所有欄位

// m.mailDelete('0516003-2018-04-21 02:51:50');
// // mailDelete(mail_id)

// m.mailReadSet('0516003-2018-04-21 14:03:44-T9229',1);
// // mailReadSet(mail_id,read_bit) set mail read_bit

// m.mailReturnSingle('0516003-2018-04-21 03:29:10',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // mailReturnSingle(mail_id) 回傳單一mail詳細資訊

// m.mailReturnReceiveList('T9229',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // mailReturnList(receiver_id) 回傳該使用者所收到mail清單（沒有信件內文）

// m.mailReturnSendList('0516003',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // mailReturnList(sender_id) 回傳該使用者所寄發mail清單（沒有信件內文）

// m.returnStudentIdList(function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳學生id,名字對應表

// m.returnTeacherIdList(function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳教授id,名字對應表

// m.researchApplyFormCreate({phone:'0900000000',student_id:'0516003',research_title:'我是專題標題2~',tname:'彭文志',first_second:2,email:'wawawa@crayonSinJang', semester:'106-2'},function(err){
// 	if(err)
// 		throw err;
// 		//老師名字若不存在，就會拋出ERROR
// }); // create research apply form

// m.researchApplyFormSetAgree({research_title:'我是專題標題2~',tname:'彭文志',first_second:2,agree:3,semester:'106-2'});
// // // set research apply form agree bit  0預設 1接受 2審核中 3拒絕

// m.researchApplyFormDelete({research_title:'我是專題標題2~',tname:'彭文志',first_second:2,semester:'106-2'});
// // delete research apply form

// m.researchApplyFormTeaReturn('T9229',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 回傳該教授的學生專題申請清單

// m.researchApplyFormPersonalReturn('0516003',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); 
// // 回傳此學生專題申請清單

// m.showGivenGradeStudentResearch('03', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 輸入系級，回傳該系級所有學生的專題資訊

// m.showResearchPage('0316003', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 用學號查詢專題的標題、網址、介紹、年度

// m.findResearchGroup({tname:'彭文志', research_title:'聊天機器人', first_second:2, semester:'106-2'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 用教授名稱、專題名稱、專題一二查詢所有同組專題生的學號

// m.setResearchPage({tname:'彭文志', research_title:'CA', first_second:2, semester:'106-2', new_title:'聊天機器人', new_link:'b', new_intro:'c'} , function(err){
// 	if(err)
// 		throw err;
// });
// // 用教授名稱、專題名稱、專題一二更新專題資訊(標題、網址、介紹)

// m.setResearchScore({student_id:'0416026',tname:'彭文志', research_title:'聊天機器人', first_second:2, semester:'106-2', new_score:88});
// // 更新專題成績

// m.createNewResearch({ student_id:'0516003',tname : '彭文志', research_title : '我是專題標題2~', first_second:2, semester: '106-2'});
// // 申請專題同意後，新增此學生專題資料到資料庫
// // 回傳此學生專題申請清單

// m.researchFileCreate({research_title:'名字呦>wO',tname:'教授喔Ow<',file_name:'檔名喔>w<',first_second:2,file_path:'路徑喔OwO',file_type:'型態喔OAO'});
// // 建立專題檔案路徑紀錄
// // {research_title,tname,file_name,file_path,file_type}

// m.researchFileReturn({research_title:'名字呦>wO',tname:'教授喔Ow<',first_second:2},function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳專題檔案路徑紀錄
// 	// {research_title,tname}

// m.showResearchInfo({research_title:'AI運算平台', tname:'吳凱強', semester:'106-2'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log	(JSON.parse(result));
// });
// // 用專題標題、老師名稱、專題學期回傳專題簡介

m.updateResearchTitle({research_title:'我是專題標題2~', tname:'彭文志', first_second:2, semester:'106-2', new_title:'New Title'});
// 使用專題標題、老師名稱、專題一二、專題學期，編輯專題標題

m.Drain(); // 關閉 connection pool