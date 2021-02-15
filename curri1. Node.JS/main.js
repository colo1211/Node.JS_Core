// 모듈은 객체형식으로 받아오게 된다.
var http = require('http'); // http 모듈을 사용
var fs = require('fs');
var url = require('url'); // url 모듈을 사용

var app = http.createServer(function(request,response){
    var _url = request.url; // /?id=CSS 등과 같이 나온다.
    var queryData = url.parse(_url,true).query; // id:'HTML', id:'CSS' , id:'JavaScript' 등과 같이 나온다(객체형식)
    var title = queryData.id;
    if(_url === '/Web'){ // 기본 페이지 일때는
        title = 'WELCOME';
    }
    if(_url === '/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`,'utf8',function(error,description){
        var template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/?id=Web">WEB</a></h1>
        <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>
`;
        response.end(template); // 어떤 코드를 넣느냐에 따라서, 사용자에게 전송하는 데이터가 바뀐다.
    })
});
app.listen(3000);