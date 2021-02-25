var mysql      = require('mysql');
var connection = mysql.createConnection({ // 접속하기 위한 정보
    host     : 'localhost',
    user     : 'nodejs',
    password : '**********',
    database : 'opentutorials'
    // ssl : true
});

connection.connect(); // connect 메소드를 통해서 호출

connection.query('select * from topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    } // 에러 있다면
    console.log(results);
}); // sql 문을 첫 번째 인자, 콜백 두 번째 인자

connection.end();