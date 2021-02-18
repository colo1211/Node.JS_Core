// array,object
// function, 함수는 객체의 일종이다. 즉, 값이다.

function f1(){
    console.log(1+1);
    console.log(1+2);
}
// f1();
// 함수를 변수에 담을 수 있으므로 값이다.
var f2 = ()=>{
    console.log(1+1);
    console.log(1+2);
}

var a= [f2]; // 배열에 요소로 함수를 담을 수 있다. 함수는 값이기 때문이다.
a[0](); //2 3

var o ={
    f1,
}

o.f1();