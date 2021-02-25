var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password : '**********',
    database : 'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
          db.query(`select * from topic`, function(error, topics){
              var title = 'Welcome';
              var description = 'Hello, Node.js';
              var list = template.list(topics);
              var HTML = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>`
              );
              response.writeHead(200);
              response.end(HTML);
          })
      } else {
          db.query(`select * from topic`, function(error, topics){ // 리스트를 만들기 위해
              if (error) throw error;
              db.query(`select * from topic where id=?`,[queryData.id],function(error2, topic){ // 사용자의 입력에 대비하기 위한 코드: ? 이후 제대로된 값을 준다.
                  if(error2) throw error2;
                  var title = topic[0].title; // topic[0]은 현재 배열 위치를 가르킨다.
                  var description = topic[0].description;
                  var list = template.list(topics); // 리스트 띄우기 위한 topics
                  var HTML = template.HTML(title, list,
                      `<h2>${title}</h2>${description}`,
                      `
                        <a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a> 
                        <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                        </form>`
                  );
                  response.writeHead(200);
                  response.end(HTML);
              })
          })
      }
    } else if(pathname === '/create'){
        db.query(`select * from topic`, function(error, topics){
            var title = 'Create';
            var list = template.list(topics);
            var HTML = template.HTML(title, list,
                `<form action="process_create" method="post">
                       <p><input type="text" name="title" placeholder="title"></p>
                       <p><textarea name = "description" placeholder="contents"></textarea></p>                        
                       <p><input type="submit"></p>
                        </form>`,
                ``);
            response.writeHead(200);
            response.end(HTML);
        })
    } else if(pathname === '/process_create'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
        db.query(`
          insert into topic(title, description, created, author_id) values(?,?, NOW(),?)`,[title,description,1],
          function (error, result){
            if(error) throw error;
            response.writeHead(302,{Location :`/?id=${result.insertId}`});
            response.end();
          });
          })
    } else if(pathname === '/update'){
        db.query(`select * from topic`, function(error, topics){
            if(error) throw error;
            db.query(`select * from topic where id=?`,[queryData.id], function (error2, topic){
                if (error2) throw error2;
                var title = topic[0].title;
                var list = template.list(topics);
                var HTML = template.HTML(title, list, `
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
                `,` <a href="/create">create</a>
                           <a href="/update?id=${topic[0].id}">update</a>`);
                response.writeHead(200);
                response.end(HTML);
            })
        })
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(error){
          if (error) throw error;
          var post = qs.parse(body);
          db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?',[post.title,post.description,post.id],function(error,result){
                  response.writeHead(302, {Location: `/?id=${post.id}`});
                  response.end();
              })
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`DELETE FROM topic WHERE id=?`,[post.id],function(error, result){
              if (error) throw error;
              response.writeHead(302,{Location :'/'});
              response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
