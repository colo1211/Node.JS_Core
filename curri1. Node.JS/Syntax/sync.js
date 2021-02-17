var fs = require('fs'); // fs 모듈을 사용한다.

// // readFileSync 동기적 'ABC'
// console.log('A');
// var result = fs.readFileSync(`./sample`,'utf-8');
// console.log(result);
// console.log('C');

// readFile 비동기적 'ACB'
console.log('A');
fs.readFile(`./sample`,'utf-8',function (error, result){
    console.log(result);
});
console.log('C');
