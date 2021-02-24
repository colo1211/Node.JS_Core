console.log(1+1);
console.log(1 == '1'); // true , ==은 관대한 비교연산 (자료형 달라도 이해)
console.log(1 === '1'); // false , ===은 엄격한 비교연산 (자료형도 같아야 True)

let args = process.argv;
console.log(args[2]);

if (args[2]===1){
    console.log('C1');
} else {
    console.log('C2');
}