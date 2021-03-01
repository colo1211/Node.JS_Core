var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var mysql = require('mysql');

var db= mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: '***********',
    database : 'opentutorials'
});

db.connect();
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
        if (queryData.id === undefined) { // 메인 페이지
            db.query(`SELECT * FROM topic`, function (error, topics) {
                var title = 'HELLO';
                var description = 'Node.JS';
                var list = template.list(topics);
                var HTML = template.HTML(title, list,`<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(HTML);
            })
        }else{
            db.query(`SELECT * FROM topic`,function(error, topics){
                db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(error, topic){
                    var title = topic[0].title;
                    var id = topic[0].id;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var HTML = template.HTML(title,list,`<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                                <a href="/update?id=${queryData.id}">update</a>
                                <form action="delete_process" method="post">
                                <p><input type="hidden" name="id" value="${queryData.id}"></p>
                                <input type="submit" value = 'delete'>
                                </form>
                                ` )
                    response.writeHead(200);
                    response.end(HTML);
                })
            })
        }
    }
    //create
    else if (pathname === '/create'){
        db.query(`SELECT * FROM topic`,function(error,topics){
            var title = 'create';
            var list = template.list(topics);
            var HTML = template.HTML(title, list,`
            <form action="process_create" method="post">
               <p><input type="text" name="title" placeholder="title"></p>
               <p><textarea name = "description" placeholder="contents"></textarea></p>                        
               <p><input type="submit"></p>
            </form>
            `,``);
            response.writeHead(200);
            response.end(HTML);
        })
    }else if (pathname ==='/process_create'){
        var body = ``;
        request.on('data',function(data){
            body= body+data;
        })
        request.on(`end`,function(){
            var post= qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            db.query(`INSERT INTO topic(title,description, created, author_id) VALUES (?,?,NOW(),?)`,
                [title,description,1],function(error,result){
                    response.writeHead(302,{Location : `/?id=${result.insertId}`});
                    response.end();
                })
        })
    }
    // Update 폼 띄우기
    else if (pathname === '/update'){
        db.query(`SELECT * FROM topic`, function(error,topics){
            db.query(`SELECT * FROM topic WHERE id =?`,[queryData.id], function(error,topic){
                      var list = template.list(topics);
                      var HTML = template.HTML (topic[0].title, list,
                          `
                       <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                </form>
                      `, '');
                      response.writeHead(200);
                      response.end(HTML);
            })
        })
    }else if (pathname === '/update_process'){
        var body =``;
        request.on('data',function(data){
            body = body + data;
        })
        request.on('end',function(error){
            var post = qs.parse(body);
            db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`,
                [post.title,post.description, post.id],function(error,result){
                    response.writeHead(302,{Location:`/?id=${post.id}`}); // 리다이렉션
                    response.end();
                })
        })
    }
    else if (pathname === '/delete_process'){
        var body = ``;
        request.on('data',function (data){
            body = body+data;
        })

        request.on('end',function (error){
            var post = qs.parse(body);
            // console.log(post);
            db.query(`DELETE FROM topic WHERE id=?`,[post.id], function(error){
                response.writeHead(302,{Location : '/'});
                response.end();
            })
        })
    }

    else {
        response.writeHead(404);
        response.end(`NOT FOUND`);
    }
});
app.listen(3000);
