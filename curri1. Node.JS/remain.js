var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryString = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    // console.log(pathname);

    // query는 객체 형식으로 어떤 queryString 이 입력 되었는지 파악하기 위한 API
    // pathname : /으로 들어온다.
    // path : /?id=HTML 형식으로 들어온다.

    if (pathname==='/'){
        if (queryString.id===undefined){ // main 페이지
            var title= 'Welcome';
            var description = 'Hello Node';
            fs.readdir('./data',function(error, fileName){
                var list = listMaker(fileName);
                var template = templateMaker(title, list,`<h2>${title}</h2><p>${description}</p>`,`<a href="/create">create</a>`
            );
                response.writeHead(200);
                response.end(template);
            })
        }else { // main 페이지가 아닌 다른 페이지
            fs.readdir(`./data`, function (error, fileName) {
                    var list = listMaker(fileName);
                    fs.readFile(`./data/${queryString.id}`, 'utf8', function (error, description) {
                        var title = queryString.id;
                        var template = templateMaker(title, list,`<h2>${title}</h2><p>${description}</p>`,
                            `    
                                <a href="/create">create</a> 
                                <a href="/update">update</a>` )
                        response.writeHead(200);
                        response.end(template)
                    })
            })
        }
    }else if (pathname ==='/create') {
        fs.readdir('./data',function(error , fileName){
            var title = 'List-Create';
            var list = listMaker(fileName);
            var template = templateMaker(title, list, `
                <form action="/process_create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
                </form>`);
            response.writeHead(200);
            response.end(template);
        })
    }else if (pathname==='/process_create'){
        var body;
        request.on('data',function(data){
            body = body+data;
        });
        request.on('end',function (){
            var post = qs.parse(body);
            var title = post.undefinedtitle;
            var description = post.description;
            fs.writeFile(`data/${title}`,description,'utf8',function(error){
                response.writeHead(302,{Location: `/?id=${title}`});
                response.end();
            })
        });
    }
    else if (pathname === '/update'){
        fs.readFile(`data/${queryString.id}`,`utf8`,function (error,description){
            fs.readdir('./data',function(error , fileName){
                var title = queryString.id;
                var list = listMaker(fileName);
                var template = templateMaker(title, list, `
                <form action="/process_create" method="post">
                <p><input type="text" name="title" placeholder="title" value=${title}></p>
                <p><textarea name="description" placeholder="description">${description}</textarea></p>
                <p><input type="submit"></p>
                </form>`);
                response.writeHead(200);
                response.end(template);
            })
        })
    }

    else{ // 아예 이상한 URL
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);

function listMaker(fileName){
    var list = `<ul>`;
    var i = 0;
    while (i < fileName.length) {
        list = list + `<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
        i++;
    }
    list = list + `</ul>`;
    return list;
}
function templateMaker(title, list, body,control){
    return `
    <!doctype html>
    <html>
    <head>
        <title>${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
<!--    <a href="/create">create</a> -->
<!--    <a href="/update">update</a>-->
    ${body}
    </body>
    </html>
    `
}
