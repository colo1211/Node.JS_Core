var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query; // query {id:'HTML'}
    var pathname = url.parse(_url,true).pathname; // pathname = '/'
    if (pathname === '/'){
        var title = 'WEB';
        var description = 'Hello Node.JS';
        if (queryData.id === undefined){
            fs.readdir(`data`,function(error, fileName){
                var list = listMaker(fileName);
                var template = templateMaker(list,title,description,`<a href=/create>create<a>`);
            response.writeHead(200);
                response.end(template);
            })
        }else {
            var title = queryData.id;
            fs.readdir(`data`,function (error,fileName){
                var list = listMaker(fileName);
                fs.readFile(`data/${title}`,'utf8',function(error,description){
                    var template = templateMaker(list,title,description,
                        `<a href='/create'>create<a> 
                                <a href='/update?id=${title}'>update<a>
                                <form action="/process_delete" method="post">
                                <input type ='hidden' name='id' value="${title}">
                                <input type ='submit' value="delete">
                                </form>`);
                    response.writeHead(200);
                    response.end(template);
                })
            })
        }
    }
    // create 생성하기 위한 Form 이 떠야한다.
    else if (pathname === '/create'){
        fs.readdir(`data`,function (error,fileName){
            var list = listMaker(fileName);
            var title = ``;
            var template = templateMaker(list,title,`
            <form action="/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name = "description" placeholder="contents"></textarea></p>
            <p><input type="submit"></p>
            </form>
            `,'');
            response.writeHead(200);
            response.end(template);
        })
    }else if (pathname === '/process_create'){
        var body =``;
        request.on('data',function(data){
           body = body+data;
        });
        request.on('end',function(error){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`,description,function(error){
                response.writeHead(302,{Location : `/?id=${title}`});
                response.end();
            })
        });
    }
    // 업데이트 폼으로 넘어가는 코드
    else if (pathname==='/update'){
        fs.readdir(`data`,function (error,fileName){
            fs.readFile(`data/${queryData.id}`,'utf8',function (error,description){
                var list = listMaker(fileName);
                var title = queryData.id;
                var template = templateMaker(list,title,`
            <form action="/process_update" method="post">
            <input type ='hidden' name ='id' value =${title}> 
            <p><input type="text" name="title" value =${title}></p>
            <p><textarea name ="description">${description}</textarea></p>
            <p><input type="submit" value ='update!'></p>
            </form>
            `,'');
                response.writeHead(200);
                response.end(template);
            })
    })
    }else if (pathname === '/process_update'){
        var body = ``;
        request.on('data',function(data){
          body+=data;
        })
        request.on('end',function(error){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`,`data/${title}`,function(error){
                fs.writeFile(`data/${title}`,description,'utf8',function (error){
                    response.writeHead(302,{Location :`/?id=${title}`})
                    response.end();
                })
            })
        })
    }
    else if (pathname === '/process_delete'){
        var body='';
        request.on('data',function(data){
            body+=data;
        })
        request.on('end',function(){
            var post = qs.parse(body);
            var id= post.id;
            fs.unlink(`data/${id}`,function(error){
                response.writeHead(302,{Location:`/`});
                response.end();
            })
        })
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }

});
app.listen(3000);

// fs.readdir 함수 내에서 작동한다.
function listMaker(fileName) {
    var i = 0;
    var list = `<ul>`;
    while (i < fileName.length) {
        list = list + `<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
        i++;
    }
    list = list + `</ul>`;
    return list;
}

function templateMaker(list, title, body, control ){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB-</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      <h2>${title}</h2>
      <p>
      ${body}
      </p>
    </body>
    </html>`
}