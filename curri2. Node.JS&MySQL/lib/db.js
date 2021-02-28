//DB 관련 모듈
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password : '**************************8',
    database : 'opentutorials',
    // multipleStatements: true // 여러개의 쿼리문을 허용하는 명령어
});
db.connect();

module.exports = db;