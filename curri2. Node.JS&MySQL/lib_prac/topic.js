var template = require('./template');
var db= require('./db');
var url = require('url');
var qs = require('querystring');

exports.main=function(request, response){
    db.query(`SELECT * FROM topic`, function (error, topics){
        var list = template.listMaker(topics);
        var title = 'Hi this is main Page';
        var description = 'Node.js';
        var templateHTML = template.templateMaker(title, list, description,`<a href='/create'>create</a>`);
        response.writeHead(200);
        response.end(templateHTML);
    })
}

exports.details= function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (error, topics) {
        db.query(`SELECT * FROM topic LEFT JOIN author ON author.id=topic.author_id WHERE topic.id = ?`, [queryData.id], function (error, topic) {
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.listMaker(topics);
            var templateHTML = template.templateMaker(title, list, `${description} <p>by ${topic[0].name}</p>`,
                `<a href='/create'>create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="process_delete" method="post">
                        <input type="hidden" name='id' value="${queryData.id}">
                        <input type="submit" value="delete">
                        </form>`);
            response.writeHead(200);
            response.end(templateHTML);
        })
    })
}

exports.create=function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error, authors){
            var list = template.listMaker(topics);
            var title = 'Create';
            var templateHTML = template.templateMaker(title, list, `
                <form action="/process_create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name = "description" placeholder="contents"></textarea></p>
                <p>${template.authorSelect(authors)}</p> 
                <input type="submit" value="생성">
                </form>
               
            `,'');
            response.writeHead(200);
            response.end(templateHTML);
        })
        })
}

exports.process_create=function(request,response){
    var body = ``;
    request.on(`data`, function (data) {
        body += data;
    })

    request.on(`end`, function (error) {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        db.query(`INSERT INTO topic(title, description, created, author_id)
                      VALUES (?, ?, NOW(), 1)`, [title, description],
            function (error, result) {
                response.writeHead(302, {Location: `/?id=${result.insertId}`});
                response.end();
            })
    })
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        var list = template.listMaker(topics);
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error, topic){
            db.query(`SELECT * FROM author`, function (error, authors){
                var title = topic[0].title;
                var list = template.listMaker(topics);
                var templateHTML = template.templateMaker(title, list, `
                    <form action="/process_update" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                    </p>
                    ${template.authorSelect(authors,topic[0].author_id)}
                    <p>
                    <input type="submit">
                    </p>
                    </form>
                `,` <a href="/create">create</a>
                           <a href="/update?id=${topic[0].id}">update</a>`);
                response.writeHead(200);
                response.end(templateHTML);
            })
        })
            })
}

exports.process_update=function(request,response){
    var body= ``;
    request.on(`data`,function(data){
        body = body + data;
    });
    request.on(`end`,function(){
        var post = qs.parse(body);
        db.query(`UPDATE topic SET title=?,description=?,author_id=? WHERE id=?`, [post.title,post.description,post.author, post.id],function(){
            response.writeHead(302, {Location : `/?id=${post.id}`});
            response.end();
        })
    });
}

exports.process_delete=function(request, response){
    var body =``;
    request.on('data',function(data){
        body = body+data;
    })
    request.on(`end`,function (){
        var post = qs.parse(body);
        console.log(post);
        db.query(`DELETE FROM topic WHERE id=?`,[post.id],function(error){
            response.writeHead(302, {Location:'/'});
            response.end();
        })
    })
}