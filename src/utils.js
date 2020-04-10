module.exports = {
    stripStrNewLineBreak: function(data){
        for(const key in data)
            if(key != 'file' && typeof(data[key]) == 'string')
                data[key] = data[key].replace(/(\r\n|\n|\r)/gm, "");
                
        return data
    }
}