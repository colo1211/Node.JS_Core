var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var path = require('path'); // 읽기 보안 -> fs.readFile
var sanitizeHTML = require('sanitize-html'); // 쓰기 보안 -> fs.writeFile

var o = {
   listMaker(fileName){
    var list = `<ul>`;
    var i=0;
    while(i<fileName.length){
        list = list + `<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
        i=i+1;
    }
    list = list+`</ul>`;
    return list;
},

    templateMaker(title, list, body,control){
    return `<!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    <h2>${title}</h2>
    ${body}
    </body>
    </html>`;
}
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryString = url.parse(_url,true).query; // {id:'HTML'}
    var pathname = url.parse(_url,true).pathname;  // '/'
    if (pathname === '/'){
        var title = 'Hello';
        var description = 'Node';
        if (queryString.id === undefined){ // 메인 페이지
            fs.readdir(`data`,function(error, fileName){
                var list = o.listMaker(fileName);
                var template = o.templateMaker(title,list,description,`<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
            })
        }else { // 메인 페이지 이외 페이지
            fs.readdir(`data`,function(error,fileName){
                var list = o.listMaker(fileName);
                var title = path.parse(queryString.id).base;
                fs.readFile(`data/${title}`,'utf8',function (error,description){
                    var template = o.templateMaker(title, list, description,`
                        <a href="/create">create</a> 
                        <a href="/update?id=${title}">update</a>
                        <form action="delete_process" method="post">
                        <input type ='hidden' name="id" value="${title}">
                        <input type="submit" value="delete">    
                        </form>    
                        `);
                    response.writeHead(200);
                    response.end(template);
                })
            })
        }
    }
    // Create
    else if (pathname === '/create'){
        fs.readdir('data',function(error, fileName){
            var title = 'create';
            var list = o.listMaker(fileName);
            var template = o.templateMaker(title,list,`
                <form action='/create_process' method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name = "description" placeholder="contents"></textarea></p>
                <p><input type="submit"></p>
                </form>
            `,'');
            response.writeHead(200);
            response.end(template);
        })
    }else if (pathname==='/create_process'){
        var body =``;
        request.on('data',function(data){
            body = body + data;
        })
        request.on('end',function (error){
            var post = qs.parse(body);
            var title = sanitizeHTML(post.title);
            var description = sanitizeHTML(post.description);
            fs.writeFile(`data/${title}`,description,'utf8',function(error){
                response.writeHead(302, {Location: `/?id=${title}`}); // redirection
                response.end();
            })
        })
    }
    // Read & Update
    else if (pathname === '/update'){
        fs.readdir('data',function(error, fileName){
            var title = path.parse(queryString.id).base;
            fs.readFile(`data/${title}`,'utf8',function (error, description){
                var title = queryString.id;
                var list = o.listMaker(fileName);
                var template = o.templateMaker(title,list,`
                <form action='/update_process' method="post">
                <input type="hidden" name ='id' value=${title}> <!--이전 제목 -->
                <p><input type="text" name="title" value=${title}></p> <!--변경 제목--> 
                <p><textarea name = "description">${description}</textarea></p>
                <p><input type="submit"></p>
                </form>
            `,'');
                response.writeHead(200);
                response.end(template);
            })
        })
    }else if (pathname === '/update_process'){
        var body =``;
        request.on('data',function(data){
            body = body + data;
        })
        request.on('end',function (error){
            var post = qs.parse(body);
            var id = post.id;
            var title = sanitizeHTML(post.title);
            var description = sanitizeHTML(post.description);
            fs.rename(`data/${id}`,`data/${title}`,function(error){
                fs.writeFile(`data/${title}`,description,'utf8',function(error){
                    response.writeHead(302, {Location: `/?id=${title}`}); // redirection
                    response.end();
                })
            })
        })
    }

    // Delete
    else if (pathname === '/delete_process'){
        var body =``;
        request.on('data',function(data){
            body = body+data;
        })
        request.on('end',function (error){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`,function (error){
                response.writeHead(302,{Location : '/'});
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

