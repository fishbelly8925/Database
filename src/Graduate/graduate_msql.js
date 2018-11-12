var CONST = require('../constant.js')

var s = require('./graduate_sqlString.js');
var psw = require(CONST.FILE_PATH);
var pool = psw.dbpsw();

module.exports = {
	ShowStudentGraduate: function(data, callback){
		const resource = pool.acquire();
		resource.then(function(c){
			var sql_ShowStudentGraduate = c.prepare(s.ShowStudentGraduate);
			var sql_ShowStudentCompulse = c.prepare(s.ShowStudentCompulse);
			c.query(sql_ShowStudentGraduate(data), function(err, result){
				if(err){
					callback(err, undefined);
					pool.release(c);
					return;
				}
				if(result.length == 0){
					callback(null, JSON.stringify(result));
					pool.release(c);
					return;
				}
				result[0]['net'] = JSON.parse(result[0]['net'])
				result[0]['media'] = JSON.parse(result[0]['media'])
				c.query(sql_ShowStudentCompulse(data), function(err, compulse){
					if(err){
						callback(err, undefined);
						pool.release(c);
						return;
					}
					compulse = JSON.parse(JSON.stringify(compulse));
					let list_compulse = [];
					for(let i = 0; i < compulse.length; i++){
						list_compulse.push(compulse[i]['cos_cname']);
					}
					result[0]['compulse'] = list_compulse;
					
					callback(null, JSON.stringify(result));
					pool.release(c);
					return;
				})
			});
		});
	},
	CreateStudentGraduate: function(data, callback){
		const resource = pool.acquire();
		resource.then(function(c){
			var sql_DeleteStudentGraduate = c.prepare(s.DeleteStudentGraduate);
			var sql_DeleteStudentCompulse = c.prepare(s.DeleteStudentCompulse);
			var sql_CreateStudentGraduate = c.prepare(s.CreateStudentGraduate);
			var sql_CreateStudentCompulse = c.prepare(s.CreateStudentCompulse);
			c.query(sql_DeleteStudentGraduate(data), function(err, result){
				if(err){
					callback(err, undefined);
					pool.release(c);
					return;
				}
				c.query(sql_DeleteStudentCompulse(data), function(err, result){
					if(err){
						callback(err, undefined);
						pool.release(c);
						return;
					}
				})
				let compulse = {};
				compulse['student_id'] = data['student_id']; 
				compulse['cos_cname'] = data['compulse']
				delete data['compulse'];
				data['net'] = JSON.stringify(data['net'])
				data['media'] = JSON.stringify(data['media'])
				c.query(sql_CreateStudentGraduate(data), function(err, result){
					if(err){
						callback(err, undefined);
						pool.release(c);
						return;
					}
					for(let i = 0; i < compulse['cos_cname'].length; i++){
						let sid = compulse['student_id']
						let cos_cname = compulse['cos_cname'][i]
						c.query(sql_CreateStudentCompulse({student_id: sid, cos_cname: cos_cname}), function(err, suc){
							if(err){
								callback(err, undefined);
								pool.release(c);
								return;
							}
						})
					}
					callback(null, JSON.stringify(result));
					pool.release(c);
					return;
				});
			});
		});
	},
	SetStudentGraduate: function(data, callback){
		const resource = pool.acquire();
		resource.then(function(c){
			var sql_SetStudentGraduate = c.prepare(s.SetStudentGraduate);
			var sql_ClearStudentCompulse = c.prepare(s.ClearStudentCompulse);
			var sql_CreateStudentCompulse = c.prepare(s.CreateStudentCompulse);
			let compulse = {};
			compulse['student_id'] = data['student_id']; 
			compulse['cos_cname'] = data['compulse']
			delete data['compulse'];
			data['net'] = JSON.stringify(data['net'])
			data['media'] = JSON.stringify(data['media'])
			c.query(sql_SetStudentGraduate(data), function(err, result){
				if(err){
					callback(err, undefined);
					pool.release(c);
					return;
				}
				c.query(sql_ClearStudentCompulse(data), function(err, suc){
					if(err){
						callback(err, undefined);
						pool.release(c);
						return;
					}
				});
				for(let i = 0; i < compulse['cos_cname'].length; i++){
					let sid = compulse['student_id']
					let cos_cname = compulse['cos_cname'][i]
					c.query(sql_CreateStudentCompulse({student_id: sid, cos_cname: cos_cname}), function(err, suc){
						if(err){
							callback(err, undefined);
							pool.release(c);
							return;
						}
					});
				}
				callback(null, JSON.stringify(result));
				pool.release(c);
				return;
			});
		});
	},
	ShowGivenGradeStudentID: function(data, callback){
		const resource = pool.acquire();
		resource.then(function(c){
			var sql_ShowGivenGradeStudentID = c.prepare(s.ShowGivenGradeStudentID);
			c.query(sql_ShowGivenGradeStudentID(data), function(err, result){
				if(err){
					callback(err, undefined);
					pool.release(c);
					return;
				}
				callback(null, JSON.stringify(result));
				pool.release(c);
				return;
			})
		});
	},
}