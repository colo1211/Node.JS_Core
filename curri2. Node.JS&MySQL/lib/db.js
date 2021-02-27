//DB 관련 모듈
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password : '*******',
    database : 'opentutorials'
});
db.connect();

module.exports = db;