f123();
console.log('A');
console.log('B');
console.log('Z');
f123();
console.log('WD');
console.log('dwq');
console.log('dqw');
f123();
//아래에 선언해도 Hoisting 되어 위로 올라간다.
function f123(){
    console.log(1);
    console.log(2);
    console.log(3);
    console.log(4);

}
// Math.round(a) : a(입력값) 를 반올림 해주는 Math 객체 내의 메소드
console.log(Math.round(2.5));
// 출력하려면 console.log( )를 붙여야 한다.

function sum (a,b){ // a,b는 parameter
    return (a+b);
}
// sum =(a,b)=>a+b; // 위의 함수 선언식을 화살표 함수로 변형 가능
console.log(sum(1,4));// a,b는 argument
