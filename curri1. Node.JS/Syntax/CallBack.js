// 익명 함수 (Anonymous Function)
var a= function (){
    console.log('A');
}
// function a(){
//     console.log('A');
// }


function showfunc(callBack){
    callBack();
}

showfunc(a);
// 전제 : JS 에서 함수는 객체
// 1. a(함수)를 argument로 showfunc에 전달
// 2. callBack 함수를 실행