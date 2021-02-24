var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring');
var path = require('path'); // 파일을 읽어오는 것을 무방비 하게 하는 것을 막기 위해!(readFile에서 사용). path.parse(주소).base
var sanitizeHTML = require('sanitize-html'); // 파일의 이상한 글을 쓰는 것을 막기 위해 사용(writeFile에서 사용)
var o = require('./lib'); // 사용할 함수에 대한 모듈을 Import 해온다.

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryString = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;

    // query는 객체 형식으로 어떤 queryString 이 입력 되었는지 파악하기 위한 API
    // pathname : /으로 들어온다.
    // path : /?id=HTML 형식으로 들어온다.

    if (pathname==='/'){
        if (queryString.id===undefined){ // main 페이지
            var title= 'Welcome';
            var description = 'Hello Node';
            fs.readdir('./data',function(error, fileName){
                var list = o.listMaker(fileName);
                var template = o.templateTxt(title, list,`<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`
            );
                response.writeHead(200);
                response.end(template);
            })
        }else { // main 페이지가 아닌 다른 페이지
            fs.readdir(`./data`, function (error, fileName) {
                    var list = o.listMaker(fileName);
                    var securityName= path.parse(queryString.id).base;
                    fs.readFile(`data/${securityName}`, 'utf8', function (error, description) {
                        var title = queryString.id;
                        var template = o.templateTxt(title, list,`<h2>${title}</h2><p>${description}</p>`,
                            `    
                                <a href="/create">create</a> 
                                <a href='/update?id=${title}'>update</a>
                                <form action="/delete_process" method="post">
                                <input type="hidden" name ='id' value="${title}">
                                <input type="submit" value="delete">
                                </form>`); // 업데이트 할 내용의 제목을 띄우기 위해서 title도 같이 전송해준다.
                        response.writeHead(200);
                        response.end(template)
                    })
            })
        }
    }else if (pathname ==='/create') {
        fs.readdir('./data',function(error , fileName){
            var title = 'List-Create';
            var list = o.listMaker(fileName);
            var template = o.templateTxt(title, list, `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
                </form>`,'');
            response.writeHead(200);
            response.end(template);
        })
    }else if (pathname==='/create_process'){
        var body;
        request.on('data',function(data){
            body = body+data;
        });
        request.on('end',function (){
            var post = qs.parse(body);
            var sanitizeTitle = sanitizeHTML(post.undefinedtitle);
            var sanitizeDescription = sanitizeHTML(post.description);
            fs.writeFile(`data/${sanitizeTitle}`,sanitizeDescription,'utf8',function(error){
                response.writeHead(302,{Location: `/?id=${sanitizeTitle}`});
                response.end();
            })
        });
    }
    // update form을 짜는 코드
    else if (pathname === '/update'){
        var securityName= path.parse(queryString.id).base;
        fs.readFile(`./data/${securityName}`,`utf8`,function (error,description){
            fs.readdir(`data`,function(error , fileName){
                var title =queryString.id;
                var list = o.listMaker(fileName);
                var template = o.templateTxt(title, list, `<form action="/update_process" method="post">
                <input type ='hidden' name = 'id' value="${title}">
                <p><input type="text" name="title" placeholder="title" value='${title}'></p>
                <p><textarea name="description" placeholder="description">'${description}'</textarea></p>
                <p><input type="submit"></p>
                </form>`,'');
                response.writeHead(200);
                response.end(template);
            })
        })
    }
    //update 내용을 post 형식으로 전달받는 코드
    else if(pathname === '/update_process'){
        var body =``;
        request.on('data',function(data){
            body= body+data; // post형식으로 들어오는 데이터들을 오는대로 합친다.
        })
        request.on('end',function(){
            var post= qs.parse(body);
            var id = post.id;
            var sanitizeTitle = sanitizeHTML(post.title);
            var sanitizeDescription = sanitizeHTML(post.description);
            fs.rename(`data/${id}`,`data/${sanitizeTitle}`,function(){
                fs.writeFile(`data/${sanitizeTitle}`,sanitizeDescription,'utf8',function(error){
                    response.writeHead(302, {Location: `/?id=${sanitizeTitle}`});
                    response.end();
                })
            })
        })
    }else if(pathname === '/delete_process'){//링크 입력할 때, /를 반드시 명시 해줘야 한다!
        var body =``;
        request.on('data',function(data){
            body += data;
        })
        request.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`,function(error){
                response.writeHead(302,{Location:`/`});
                response.end();
            })
        })
    }
    else{ // 아예 이상한 URL
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);
