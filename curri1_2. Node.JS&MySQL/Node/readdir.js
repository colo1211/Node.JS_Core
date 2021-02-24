const fs= require('fs');
const testFolder= '../data';

fs.readdir(testFolder,function (error,fileName){
    console.log(fileName);
})