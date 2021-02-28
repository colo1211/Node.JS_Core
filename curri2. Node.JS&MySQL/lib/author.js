var template = require('./template');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
var sanitizeHTML = require('sanitize-html');

exports.home= function(request, response){
    db.query(`select * from topic`, function(error, topics){
        db.query (`select * from author`, function (error, authors){
            var title = 'Welcome';
            var list = template.list(topics);
            var HTML = template.HTML(title, list,
                `${template.authorTable(authors)}
                        <style>
                         table{
                            border-collapse: collapse;
                         }
                         td{
                            border: 1px solid black;
                         }
                         </style>
                         <form action = '/author/create' method="post">
                         <p><input type="text" name="title" placeholder="title"></p>
                         <p><textarea name="description" placeholder="description"></textarea></p>
                         <p><input type="submit" value="저자 목록 생성"></p>
                         </form>
                        `,
                ``
            );
            response.writeHead(200);
            response.end(HTML);
        })
    })
}

exports.create = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          insert into author(name, profile) values(?,?)`,[post.title,post.description],
            function (error, result){
                if(error) throw error;
                response.writeHead(302,{Location :`/author`});
                response.end();
            });
    })
}

exports.update = function (request, response){
    db.query(`select * from topic`, function(error, topics){
        db.query (`select * from author`, function (error, authors){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`select * from author where id = ?`,[queryData.id],function(error, author){
                var title = 'author';
                var list = template.list(topics);
                var HTML = template.HTML(title, list,
                    `${template.authorTable(authors)}
                        <style>
                         table{
                            border-collapse: collapse;
                         }
                         td{
                            border: 1px solid black;
                         }
                         </style>
                         <form action = '/author/update_process' method="post">
                         <input type ='hidden' name ='id' value="${queryData.id}">
                         <p><input type="text" name="title" placeholder="title" value="${author[0].name}"></p>
                         <p><textarea name="description" placeholder="description">${author[0].profile}</textarea></p>
                         <p><input type="submit" value="저자 목록 수정"></p>
                         </form>
                        `,
                    ``
                );
                response.writeHead(200);
                response.end(HTML);
            })
        })
    })
}

exports.process_update = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(error){
        if (error) throw error;
        var post = qs.parse(body);
        // console.log(post);
        db.query('UPDATE author SET name=?, profile=? WHERE author.id=?',
            [post.title, post.description, post.id],
            function(error,result){
                response.writeHead(302, {Location: `/author`});
                response.end();
            })
    }
    );
}

exports.process_delete = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function (error){
            db.query(`DELETE FROM author WHERE author.id=?`,[post.id],function(error, result){
                if (error) throw error;
                response.writeHead(302,{Location :'/author'});
                response.end();
            })
        })
    });
}