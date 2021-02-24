// var v1 = 'v1';
// // 10000줄의 코드가 존재한다 가정
// v1= 'egoing'; // 값의 변경
// var v2 = 'v2';

// 객체를 사용함으로써 변수를 정리정돈
// 함수는 값이기 때문에 객체에 담을 수 있다.
var o ={
    v1:'v1',
    v2:'v2',
    f1: function(){
        console.log(this.v1); // 함수가 객체 안에서 시행될때, 자신이 속한 객체를 참조할 수 있는 this를 약속된 키워드로 생성했다.
        // console.log(o.v1);
    },
    f2(){
        console.log(this.v2);
        // console.log(o.v2);
    }
};
o.f1();
o.f2();
// function f1(){
//     console.log(o.v1);
// }
//
// function f2(){
//     console.log(o.v2);
// }
