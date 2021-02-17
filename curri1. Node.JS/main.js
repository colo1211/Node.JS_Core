// 모듈은 객체형식으로 받아오게 된다.
var http = require('http'); // http 모듈을 사용
var fs = require('fs');
var url = require('url'); // url 모듈을 사용

var app = http.createServer(function(request,response){
    var _url = request.url; // /?id=CSS 등과 같이 나온다.
    var queryData = url.parse(_url,true).query; // id:'HTML', id:'CSS' , id:'JavaScript' 등과 같이 나온다(객체형식)
    var pathname = url.parse(_url,true).pathname; // pathname = '/', path='/?id=HTML

    if (pathname==='/') {
        if (queryData.id === undefined){ // main 페이지
            // 메인페이지에서 리스트 처리
            fs.readdir('./data',function(error,fileName){
                var title = 'WelCome';
                var description= 'Hello Node.js';
                var list = listMaker(fileName);
                var template=templateTxt(title,list,`<h2>${title}</h2>${description}`);
                response.writeHead(200); // 성공적으로 로딩
                response.end(template); // 어떤 코드를 넣느냐에 따라서, 사용자에게 전송하는 데이터가 바뀐다.
            })
        }else { // pathname이 undefined가 아니라면 ex) CSS,HTML 등
            // 메인 페이지가 아닌 곳에서의 리스트 처리
                fs.readdir('./data',function(error,fileName){
                    var list = listMaker(fileName);
                    fs.readFile(`./data/${queryData.id}`,'utf8',function(error,description){
                        var title = queryData.id;
                        var template = templateTxt(title,list,`<h2>${title}</h2>${description}`);
                        response.writeHead(200); // 성공적으로 로딩
                        response.end(template); // 어떤 코드를 넣느냐에 따라서, 사용자에게 전송하는 데이터가 바뀐다.
                    })
            })

    }
    }

    // 이상한 URL을 입력했을 때
    else {
        response.writeHead(404); // 로딩 실패
        response.end('Not Found'); // 어떤 코드를 넣느냐에 따라서, 사용자에게 전송하는 데이터가 바뀐다.
    }
});
app.listen(3000);

function templateTxt(title, list, body){ // 화면에 출력할 template을 만들어 주는 함수
    return `
        <!doctype html>
        <html>
        <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/?id=Web">WEB</a></h1>
        ${list}    
        ${body};
        </body>
        </html>
     `;
}
function listMaker(fileName){ // 파일 리스트를 만들어 주는 함수
    var list= `<ul>`;
    var i =0;
    while(i<fileName.length){
        list = list+`<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
        i=i+1;
    }
    list = list+'</ul>';
    return list;
}