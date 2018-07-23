var ResearchShow = require('./Research/Show/research_show_msql.js')
var ResearchUpdate = require('./Research/Update/research_update_msql.js')
var Mail = require('./Mail/mail_msql.js');
var Assistant = require('./Assistant/assistant_msql.js');
var QA = require('./QA/qa_msql.js');
var StudentShow = require('./Student/Show/student_show_msql.js');
var StudentUpdate = require('./Student/Update/student_update_msql.js');
var Course = require('./Course/course_msql.js');
var Teacher = require('./Teacher/teacher_msql.js');

function merge(modu){
    var result = {};
    for(var idx in modu)
        for(var i in modu[idx])
            result[i]=modu[idx][i];
    return result;
}

module.exports = merge([StudentUpdate, StudentShow, Course, Teacher, ResearchShow, ResearchUpdate, Mail, Assistant, QA]);