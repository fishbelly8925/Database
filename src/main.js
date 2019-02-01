// 使用前請先
// npm install mariasql
// npm install generic-pool

var m = require('./msql.js');

// m.ShowUserInfo('0316003', function(err, result){
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

// m.ShowUserAllScore('0416312', function(err, result){
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

// m.ShowCosGroup('0316084', function(err, result){
//     if(err)
//         throw err;
//     console.log(JSON.parse(result));
// }); // ShowCosGroup 列出此學生畢業預審表上 必修、核心、副核心等課程分類

// m.ShowGraduateRule('0316084', function(err, result){
//     if(err)
//         throw err;
// 	   console.log(JSON.parse(result));
// }); // ShowGraduateRule 列出此學生畢業標準

// m.ShowUserOffset('0513311', function(err, result){
//     if(err)
//         throw err;
// 	   console.log(JSON.parse(result));
// }); // ShowUserOffset 個人抵免資料 (輸入all顯示全部)

// m.ShowUserOnCos('all', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowUserOnCos 大四個人當期修課資料 (輸入all顯示全部)

// m.general_cos_rule(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // general_cos_rule 外系通識規則

// m.ShowGraduateStudentList('04', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowGraduateStudentList 列出此學號開頭的學生的畢業資訊(輸入all顯示全部)(助理端用)

// m.SetEnCertificate('0516003', 1);
// SetEnCertificate 設定某學生的英檢狀態
// 通過外語榮譽學分(英語)`抵免 → 免修 -> 1
// 通過英檢免試申請(換修) → 一學分都不能底！ 可以修二外當大一英文或進階英文 -> 2
// 通過英檢中高級初試(本校團測場次)　→ 一學分都不能底！ 可以修二外當大一英文或進階英文 -> 3
// 自行報考通過 → 一學分都不能底！ 可以修二外當大一英文或進階英文 -> 4
// 1 → 英文一定要修滿八學分 不能用二外抵 -> 0

// m.SetGraduateSubmitStatus({id:'0416016', graduate_submit: 0, submit_type: 3, net_media: 2}, function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// SetGraduateSubmitStatus 設定某學生的畢業預審確認狀態(0未送審, 1送審中, 2審核通過, 3審核不通過)(0舊制,1 新制,2 不變更,3 null)
// 設定學生選擇網路、多媒體net_media(0網路, 1多媒體, 其他值不更改)

// m.SetUserOAuth('0516003', '456', 3);
// // SetUserOAuth   1:set gmail   2:set fb_id   3:set github_id

// m.SetCosMotion('0516003', 'test', 'a', 'c', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// SetCosMotion(id, cos_name, original position, now position) 更新課程位置

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
// 	console.log(JSON.parse(result));
// }); // ShowRecommendCos(student_id, callback) 回傳某學生的推薦課程

// data_SetRecommendCosStar = {
// 	student_id: '0516003',
// 	unique_id: '107-2-5258',
// 	star_level: 4
// }

// m.SetRecommendCosStar(data_SetRecommendCosStar, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// })

// 設定推薦課程的星星等級，如果已經存在就覆寫

// m.ShowGradeTeacherResearchStudent('T0009','',function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // ShowTeacherResearchStudent(teacher_id, callback) 回傳某教授指定系級的專題生和專題題目，1表示本系生，0表示外系生

// m.ShowTeacherInfoResearchCnt(function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result)[8]);
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

// m.ShowGradeStudentIdList('05', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳系級學生id, 名字對應表，1表示本系生，0表示外系生

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

// m.CreateNewResearch({ student_id:'0516003', tname : '彭文志', research_title : 'testttt_2', first_second:2, semester: '106-2'});
// // 申請專題同意後，新增此學生專題資料到資料庫

// m.ChangeResearch({ student_id:'0516003', tname : '彭文志', research_title : 'testyeeeee', first_second:2, semester: '106-1'});
// // 申請換專題，修改此學生專題資料

// m.DeleteResearch({ student_id:'0516003', first_second:2, semester: '106-1'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); 
// // 讓助理可以刪掉CPE未過但被教授同意的人的專題

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

// m.SetFirstSecond({student_id: '0512204'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); 
// // CPE未通過申請專題 first_second = 3 助理確認CPE通過後可將 3 改為 1

// m.ShowResearchScoreComment({semester: '106-2', first_second: 2}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); 
// 回傳專題成績列表:教授名字, 學生姓名學號, 成績, 評論

// m.ShowStudentMentor('0516003', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 輸入學生學號，回傳該學生導師

// m.ShowSemesterScore('0513109', function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result)[3]);
// }); // 輸入學生學號，回傳該學生每學期平均,有無被21,學期平均,各科成績

// m.ShowStudentResearchStatus('0413328', function(err, result){
//     if(err)
//         throw err;
// 	console.log(JSON.parse(result));
// });// 輸入學生學號，回傳該學生填專題表時的狀況 
// // 1:代表專題1 (基礎程式設計已過) 
// // 2:代表專題2 (已修過專1成績為通過)
// // 3:代表 基礎程式設計成績待審核(還沒資料, 如果沒過之後會被取消) 
// // 4:代表重複提交(當學期只能有一個專題/專題申請表)
// // 5:代表 已修過專1專2的白目

// m.ShowStudentResearchList({first_second:1, semester:'106-2'},function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳某學期的專題清單

// m.SetResearchAddStatus({student_id: '0413328', research_title: 'Piano Finger Tracker - 偵測並記錄指法的智慧樂譜', semester: '106-2', first_second: 1, add_status: 0}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); 
// // 修改專題資料的 add_status, 0代表尚未加選 1代表已加選


// data = { 
// 	student_id: '0516003',
// 	phone: '0123456789',
// 	apply_year: '107',
// 	apply_semester: '1',
// 	cos_dep_old: '電子系',
// 	cos_tname_old: '桑梓賢',
// 	cos_cname_old: '線性',
// 	cos_code_old:  'DEC1413',
// 	cos_cname: '線性代數',
// cos_code: 'DCP2354',
// cos_type: '必修',
// reason: 'YAAAA YOOOO YEEEE',
// credit_old: 3,
// file: 'LOOOOOOOOOO',
// school_old: 'NTCU',           
// dep_old: '應數系',              
// graduation_credit_old: 128,
// cos_year_old: 106,         
// cos_semester_old: 2,     
// score_old: 92,
// offset_type: 2
// };

// m.CreateOffsetApplyForm(data,function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 	建立課程抵免申請單，回傳對DB造成的info 
// 	   //	offset_type -> 0 外系抵免 1 英授抵免 2 轉校轉系抵免  



// data = {
// 	student_id: '0516004',
// 	cos_cname_old: 'YAAAAAAA',
// 	cos_code_old:  'YOOOOOOO'
// }
// m.DeleteOffsetApplyForm(data,function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // delete offset apply form


// data = {
// 	student_id: '0516003',
// 	apply_year: '107',
// 	apply_semester: '1',
// 	cos_code_old: 'YOOOOOOO',
// 	cos_cname_old:'YAAAAAAA',
// 	cos_code: 'DCP1200',
// 	cos_cname: '生涯規劃及導師時間',
// 	credit: 0,
// 	cos_type: '必修'
// }
// m.CreateOffset(data,function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // create offset


// data1 = {student_id: '0516003'} // return single student offset apply form
// data2 = {all_student: true} // return all student offset apply form
// m.ShowUserOffsetApplyForm(data2,function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });	

data = {
	student_id: '0516003',
	cos_cname_old: '線性',
	cos_cname: '線性代數'
}
m.ShowGivenOffsetApplyForm(data,function(err,result){
	if(err)
		throw err;
	console.log(JSON.parse(result));
});// 顯示搜尋的申請單

// data = {
// 	student_id: '0516002',
// 	cos_cname_old: '線性代數',
// 	cos_code_old:  'DEE1313',
// 	state: 1 // 0 尚未決定，1 助理同意，2 主任同意，3 助理不同意，4 主任不同意
// }
// m.SetOffsetApplyFormAggreStatus(data,function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });

// m.ShowGivenGradeStudent({grade: '四'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// 輸入一二三四，顯示某年級所有學生,1表示本系生，0表示外系生

// m.ShowStudentGraduate({student_id: '0516202'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// 顯示某學生畢業預審

// data_CreateStudentGraduate = {
// 	student_id: '0516202',
// 	graduate_status: 1,
//     total_credit: 100,
//     en_course: 2,
//     pro: 1,
//     other: 1,
//     net: ['網通', '網成社', '計網概'],
//     media: ['多媒體', '計圖學'],
//     old_total: 1,
//     old_contemp: 1,
//     old_culture: 1,
//     old_history: 1,
//     old_citizen: 1,
//     old_group: 1,
//     old_science: 1,
//     new_total: 1,
//     new_core_total: 1,
//     new_core_society: 1,
//     new_core_humanity: 1,
//     en_total: 1,
//     new_basic: 1,
//     new_cross: 1,
//     en_basic: 1,
//     en_advanced: 1,
//     pe: 1,
//     service: 1,
//     art: 1,
//     mentor: 1,
//     compulse: ['計算機a', '計算機1', '計算機2'],
//     current: ['計算機a', '計算機1', '計算機2']
// }

// m.CreateStudentGraduate(data_CreateStudentGraduate, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// 建立某學生畢業預審

// data_SetStudentGraduate = {
//     student_id: '0516202',
//     graduate_status: 1,
//     total_credit: 100,
//     en_course: 2,
//     pro: 1,
//     other: 1,
//     net: ['網通', '網成社', '計網概'],
//     media: ['多媒體'],
//     old_total: 1,
//     old_contemp: 1,
//     old_culture: 1,
//     old_history: 1,
//     old_citizen: 1,
//     old_group: 1,
//     old_science: 1,
//     new_total: 1,
//     new_core_total: 1,
//     new_core_society: 1,
//     new_core_humanity: 1,
//     new_basic: 1,
//     new_cross: 1,
//     en_total: 1,
//     en_basic: 1,
//     en_advanced: 1,
//     pe: 1,
//     service: 1,
//     art: 1,
//     mentor: 1,
// 	compulse: ['計算機a', '計算機b', '計算機c'],
//     current: ['計算機a', '計算機1', '計算機2']
// }

// m.SetStudentGraduate(data_SetStudentGraduate, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// 修改某學生畢業預審

// m.ShowGivenGradeStudentID({grade: '四'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// // 顯示某年及所有學號

// m.ShowStudentHotCos({student_id: '0516205'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// });
// 顯示某一屆當期的熱門選課(會是自己沒有修過的課)

// m.ShowStudentFirstSecond('0512204',function(err,result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result));
// }); // 回傳當學期的專題是一或二

// m.ShowResearchTitleNumber({tname:'彭文志', research_title:'testttt', semester:'106-2'}, function(err, result){
// 	if(err)
// 		throw err;
// 	console.log(JSON.parse(result)[0]['count']);
// });
// // 查詢該學期該教授的此題目，目前有幾筆


m.Drain(); // 關閉 connection pool
