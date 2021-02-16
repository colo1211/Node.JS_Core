//CRUD
//create
var arr1 = new Array();
var arr2=[];
console.log(typeof(arr1),typeof(arr2)); // Object

var arr= [1,2,3,4];
console.log(arr.length); // 4;
arr.pop(); // 맨 마지막 요소 제거
console.log(arr);

// array-loop
let number = [1,400,12,34,5];
let count = 0;
while(number.length>0){
    count+=number.shift();
}
console.log(`count:${count}`);