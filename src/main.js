// 使用前請先
// npm install mariasql
// npm install generic-pool

var m = require('./msql.js');

// m.ShowUserInfo('0516003', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowUserInfo 回傳學生資料

//m.SetUserEmail('0516003', 'da2bct@test');
// SetUserEmail(學號, email) 更新此學號學生之email

// m.ShowCosMapRule('0316003', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowCosMapRule 課程地圖要顯示的項目以及建議先修課與擋修課程

// m.ShowCosMapPass('0312512', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowCosMapPass 某學生在課程地圖上有通過的課

// m.ShowUserTotalCredit('0516003', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowUserTotalCredit 回傳某學生總學分數

// m.ShowUserAllScore('0516007', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowUserAllScore 列出此學生通過的課
// 測試學號
// 軍訓 0116089
// 霹靂悠 0516007
// 轉系抵免 0411276 

// m.ShowUserPartScore('0516003', '通識', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowUserPartScore 列出此學生某向度中通過的課

// m.ShowCosGroup('0516003', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowCosGroup 列出此學生畢業預審表上 必修、核心、副核心等課程分類

// m.ShowGraduateRule('0516075', function(err, result){
//     if(err)
//         throw err;
// 	   console.log(JSON.parse(result));
// }); // ShowGraduateRule 列出此學生畢業標準

// m.ShowUserOffset('0516205', function(err, result){
//     if(err)
//         throw err;
// 	   console.log(JSON.parse(result));
// }); // ShowUserOffset 個人抵免資料 (輸入all顯示全部)

// m.ShowUserOnCos('0316067', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowUserOnCos 大四個人當期修課資料 (輸入all顯示全部)

// m.general_cos_rule(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // general_cos_rule 外系通識規則

// m.ShowGraduateStudentList('05', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowGraduateStudentList 列出此學號開頭的學生的畢業資訊(輸入all顯示全部)(助理端用)

// m.SetEnCertificate('0516003', 1);
// SetEnCertificate 設定某學生的英檢狀態
// 通過外語榮譽學分(英語)抵免 → 免修 -> 1
// 通過英檢免試申請 → 一學分都不能底！ 可以修二外當進階英文 -> 2
// 通過英檢中高級初試(本校團測場次)　→ 一學分都不能底！ 可以修二外當進階英文 -> 3
// 自行報考通過 → 一學分都不能底！ 可以修二外當進階英文 -> 4
// NULL → 英文一定要修滿八學分 不能用二外抵 -> 0

// m.SetStudentGraduateStatus('0516003', 1);
// // SetStudentGraduateStatus 設定某學生的畢業狀態(1可畢業, 0不可畢業)（助理端用）

// m.SetGraduateSubmitStatus('0516003', 1);
// // SetGraduateSubmitStatus 設定某學生的畢業預審確認狀態(1可畢業, 0不可畢業)

// m.SetUserOAuth('0516003', '456', 3);
// // SetUserOAuth   1:set gmail   2:set fb_id   3:set github_id

// m.SetCosMotion('0516003', 'test2', 'a', 'c');
// // SetCosMotion(id, cos_name, original position, now position) 更新課程位置

// m.ShowCosMotionLocate('0516003', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // ShowCosMotionLocate(id, callback) 回傳學生修改課程位置

// m.DeleteCosMotion('0516003');
// // DeleteCosMotion(id) 刪除學生課程位置紀錄

// m.CreateQA('aaa', 'bbb', function(err){
// 	if(err)
// 		throw err;
// });
// // CreateQA(question, answer, callback) 新增問答

// m.ShowAllQA(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(result);
// });
// //ShowAllQA(callback) 回傳所有問答

// m.DeleteQA(0, function(err){
// 	if(err)
// 		throw err;
// });
// // DeleteQA(id, callback) 刪除編號id的紀錄

// m.ShowTeacherCosNow('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowTeacherCosNow(id, callback) 某老師當學期開課

// m.ShowTeacherCosAll('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowTeacherCosAll(id, callback) 某老師所有開過的課

// m.ShowTeacherMentors('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowTeacherMentors(id, callback) 某老師導生名單

// m.ShowCosMapIntro('訊號與系統', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // ShowCosMapIntro(cos_cname, callback) 課程地圖某堂課的資訊

// m.ShowCosScoreDetail('DCP3595', '105-2-1191', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // ShowCosScoreDetail(cos_code, unique_id, callback) 某堂課的成績詳細資料

// m.ShowCosScoreInterval('DCP3595', '105-2-1191', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // ShowCosScoreInterval(cos_code, unique_id, callback) 某堂課的成績區間人數

// m.ShowRecommendCos('0516003', function(err, result){
// 	if(err)
// 		throw err;
// // 	console.log(JSON.parse(result));
// }); // ShowRecommendCos(student_id, callback) 回傳某學生的推薦課程

// m.ShowTeacherResearchStudent('T0616', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowTeacherResearchStudent(teacher_id, callback) 回傳某教授所有專題生和專題題目，1表示本系生，0表示外系生

// m.ShowGradeTeacherResearchStudent('T0616', '04',function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowTeacherResearchStudent(teacher_id, callback) 回傳某教授指定系級的專題生和專題題目，1表示本系生，0表示外系生

// m.ShowTeacherInfoResearchCnt(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result)[9]);
// }); // ShowTeacherInfoResearchCnt(callback) 回傳所有教授各屆的學生人數

// m.CreateMail({sender_id:'0516003', title:'test~~', receiver_id:'T9229', content:'這是一個測試信件這是一個測試信件'});
// // CreateMail(data) data type 為JSON，新增一則信件，需有以上所有欄位

// m.DeleteMail('0516003-2018-04-21 02:51:50');
// // DeleteMail(mail_id)

// m.SetMailRead('0516003-2018-04-21 14:03:44-T9229', 1);
// // SetMailRead(mail_id, read_bit) set mail read_bit

// m.ShowMailInfo('0516003-2018-04-21 03:29:10', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowMailInfo(mail_id) 回傳單一mail詳細資訊

// m.ShowMailRcdList('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowMailRcdList(receiver_id) 回傳該使用者所收到mail清單（沒有信件內文）

// m.ShowMailSendList('0516003', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowMailSendList(sender_id) 回傳該使用者所寄發mail清單（沒有信件內文）

// m.ShowStudentIdList(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳學生id, 名字對應表

m.ShowGradeStudentIdList('05', function(err, result){
	if(err)
		throw err;
	console.log(JSON.parse(result));
}); // 回傳系級學生id, 名字對應表，1表示本系生，0表示外系生

// m.ShowTeacherIdList(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳教授id, 名字對應表

// m.CreateResearchApplyForm({phone:'0900', student_id:'0516003', research_title:'我是專題標題~', tname:'彭文志', first_second:2, email:'wawawa@crayonSinJang', semester:'106-2'}, function(err){
// 	if(err)
// 		throw err;
// 		//老師名字若不存在，就會拋出ERROR
// }); // create research apply form

// m.SetResearchApplyFormStatus({research_title:'我是專題標題2~', tname:'彭文志', first_second:2, agree:3, semester:'106-2'});
// // // set research apply form agree bit  0預設 1接受 2審核中 3拒絕

// m.DeleteResearchApplyForm({research_title:'我是專題標題2~', tname:'彭文志', first_second:2, semester:'106-2'});
// // delete research apply form

// m.ShowTeacherResearchApplyFormList('T9229', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 回傳該教授的學生專題申請清單，1表示本系生，0表示外系生

// m.ShowStudentResearchApplyForm('0416004', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); 
// //回傳此學生專題申請清單，1表示本系生，0表示外系生

// m.ShowGivenGradeStudentResearch('03', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 輸入系級，回傳該系級所有學生的專題資訊

// m.ShowStudentResearchInfo('0410835', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // // 用學號查詢專題的標題、網址、介紹、年度，1表示本系生，0表示外系生
// // 0410835 電機系

// m.ShowResearchGroup({tname:'彭文志', research_title:'聊天機器人', first_second:2, semester:'106-2'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 用教授名稱、專題名稱、專題一二查詢所有同組專題生的學號

// m.SetResearchInfo({tname:'林文杰', research_title:'聊天機器人2', first_second:2, semester:'106-2', new_title:'聊天機器人', new_link:'gggg', new_intro:'c'}, function(err){
// 	if(err)
// 		throw err;
// });
// // 用教授名稱、專題名稱、專題一二更新專題資訊(標題、網址、介紹)

// m.SetResearchScoreComment({student_id:'283u291', tname:'彭文志', research_title:'聊天機器人', first_second:2, semester:'106-2', new_score:88, new_comment:'Yee!'});
// // 更新專題成績、評語

// m.CreateNewResearch({ student_id:'0516003', tname : '彭文志', research_title : 'testyeeeee', first_second:2, semester: '106-1'});
// // 申請專題同意後，新增此學生專題資料到資料庫

// m.ChangeResearch({ student_id:'0516003', tname : '彭文志', research_title : 'testyeeeee', first_second:2, semester: '106-1'});
// // 申請換專題，修改此學生專題資料

// m.CreateResearchFile({research_title:'名字呦>wO', tname:'教授喔Ow<', file_name:'檔名喔>w<', first_second:2, file_path:'路徑喔OwO', file_type:'型態喔OAO'});
// 建立專題檔案路徑紀錄
// {research_title, tname, file_name, file_path, file_type}

// m.ShowResearchFilePath({research_title:'名字呦>wO', tname:'教授喔Ow<', first_second:2}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳專題檔案路徑紀錄
// 	//{research_title, tname}

// m.SetResearchTitle({research_title:'我是專題標題2~', tname:'彭文志', first_second:2, semester:'106-2', new_title:'New Title'});
// 使用專題標題、老師名稱、專題一二、專題學期，編輯專題標題

// m.ShowResearchScoreComment({semester: '106-2', first_second: 2}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳專題成績列表:教授名字, 學生姓名學號, 成績, 評論

// m.ShowStudentMentor('0516003', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 輸入學生學號，回傳該學生導師

// m.ShowSemesterScore('0516075', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 輸入學生學號，回傳該學生每學期平均,有無被21,學期平均,各科成績

// m.ShowStudentResearchStatus('0516003', function(err, result){
//     if(err)
//         throw err;
// 	console.log(JSON.parse(result));
// });// 輸入學生學號，回傳該學生填專題表時的狀況 
// 1:代表專題1 (基礎程式設計已過) 
// 2:代表專題2 (已修過專1成績為通過)
// 3:代表 基礎程式設計成績待審核(還沒資料, 如果沒過之後會被取消) 
// 4:代表重複提交(當學期只能有一個專題/專題申請表)
// 5:代表 已修過專1專2的白目

// m.ShowStudentResearchList({first_second:1, semester:'106-2'},function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳某學期的專題清單


m.Drain(); // 關閉 connection pool
