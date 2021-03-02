var db = require('./db');
var template = require('./template');
var qs= require('querystring');
var url= require('url');

exports.home=function(request, response){
    db.query(`SELECT * FROM author`,function(error, authors){
        db.query(`SELECT * FROM topic`, function(error, topics){
            var title = 'author';
            var list = template.listMaker(topics);
            var HTML = template.templateMaker(title, list, `
            ${template.authorList(authors)}
            <style> 
            td{
                border: 1px solid black;
            }
            table{
                border-collapse: collapse;
            }
            </style>
            <a href ="/author/create">create</a>
            ` ,``);
            response.writeHead(200);
            response.end(HTML);
        })
    })
}

exports.create = function (request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        var list = template.listMaker(topics);
        db.query(`SELECT * FROM author`, function(error, author){
            var title = 'create';
            var HTML = template.templateMaker(title, list, `
            ${template.authorList(author)}
            <style>
            td{
            border: 1px solid black;
            }
            table{
            border-collapse: collapse;
            }
            </style>
            <form action="/author/process_create" method="post">
            <p><input type="text" name="name" placeholder="name"></p>
            <p><textarea name="profile" placeholder="profile"></textarea></p>
            <input type="submit" value="저자 목록 추가">
            </form>  
            `,'');
            response.writeHead(200);
            response.end(HTML);
        })
    })
}

exports.process_create=function(request,response){
    var body =``;
    request.on(`data`,function(data){
        body = body+data;
    })
    request.on('end',function(){
        var post = qs.parse(body);
        db.query(`INSERT INTO author(name,profile) VALUES (?,?)`,[post.name,post.profile],function(){
            response.writeHead(302, {Location :'/author'});
            response.end();
        })
    })
}

exports.update=function(request,response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        var list = template.listMaker(topics);
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        // console.log(queryData.id);
        db.query(`SELECT * FROM author`, function(error, authors){
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(error, author){
                var title = 'update';
                var HTML = template.templateMaker(title, list, `
            ${template.authorList(authors)}
            <style>
            td{
            border: 1px solid black;
            }
            table{
            border-collapse: collapse;
            }
            </style>
            <form action="/author/process_update" method="post">
            <input type ='hidden' name ='id' value="${queryData.id}">
            <p><input type="text" name="name" value="${author[0].name}"></p>
            <p><textarea name="profile">${author[0].profile}</textarea></p>
            <input type="submit" value="저자 목록 수정">
            </form>  
            `,'');
                response.writeHead(200);
                response.end(HTML);
            })
        })
    })
}

exports.process_update= function(request, response){
    var body =``;
    request.on(`data`,function(data){
        body = body+data;
    })
    request.on('end',function(){
        var post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,[post.name,post.profile,post.id],function(){
            response.writeHead(302, {Location :'/author'});
            response.end();
        })
    })
}

exports.process_delete= function(request, response,queryData){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
            db.query(`DELETE FROM author WHERE author.id=?`,[post.id],function(error, result){
                if (error) throw error;
                response.writeHead(302,{Location :'/author'});
                response.end();
            })
    });
}

