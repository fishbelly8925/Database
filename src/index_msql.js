var ResearchShow = require('./Research/Show/msql.js')
var ResearchUpdate = require('./Research/Update/msql.js')
var Mail = require('./Mail/msql.js');
var Assistant = require('./Assistant/msql.js');
var QA = require('./QA/msql.js');

function merge(modu){
    result={}
    for(var idx in modu)
        for(var i in modu[idx])
            result[i]=modu[idx][i];
    return result;
}

module.exports = merge([ResearchShow, ResearchUpdate, Mail, Assistant, QA]);