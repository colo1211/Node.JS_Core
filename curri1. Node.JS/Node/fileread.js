// Node.js의 파일 읽기 기능 fs모듈 - file system
var fs = require('fs');
fs.readFile('./sample.txt','utf8',function(error,data){
    if (error) throw error;
    else console.log(data);
})