var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(bodyParser.urlencoded({ extended: false })); // body-parser 미들웨어 리턴, post 방식으로 데이터를 가져오는데 사용하는 문장
app.use(compression()); // compression 미들웨어 리턴, app use를 통해서 장착
app.get('*',function(request, response,next){
   fs.readdir(`./data`,function(error, fileList){
        request.list= fileList;
        next(); // next에는 그 다음에 호출되어야 하는 미들 웨어가 담김 -> 미들웨어를 실행시키는 역할
   });
});
app.use(express.static('public'));

// 메인 페이지
app.get('/', function (request, response){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
                  <img src="/images/hello.jpg" style="width:300px; display:block; margin:10px;">
            `,
            `<a href="/create">create</a>`
        );
        response.send(html);
})
// 상세 페이지
app.get(`/page/:pageId`, function(request, response,next){
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            if (err) {
                next(err);
            }else {
                var title = request.params.pageId;
                var sanitizedTitle = sanitizeHtml(title);
                var sanitizedDescription = sanitizeHtml(description, {
                    allowedTags: ['h1']
                });
                var list = template.list(request.list);
                var html = template.HTML(sanitizedTitle, list,
                    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                    ` <a href="/create">create</a>
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
                );
                response.send(html);
            }
        });

})

// Create
app.get(`/create`, function(request,response){
        var title = 'WEB - create';
        var list = template.list(request.list);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.send(html);
})

// Create - Post 방식으로 받기
app.post(`/create_process`,function(request,response){
        var post = request.body;
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.redirect(`/page/${title}`);
        })
})

// Update Form
app.get (`/update/:pageId`, function(request, response){
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = request.params.pageId;
            var list = template.list(request.list);
            var html = template.HTML(title, list,
                `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
                `<a href="/create">create</a> <a href="/update/${title}">update</a>`
            );
            response.send(html);
    });
})

// Update Form에서 전달한 내용 전달받기
app.post(`/update_process`,function(request, response){
        var post = request.body;
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.redirect(`/page/${title}`);
            })
        });
})

// Delete
app.post (`/delete_process`, function(request, response){
        var post = request.body;
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
            response.redirect('/');
        })
})


// localhost:3000/1e21321312 와 같이 터무니 없는 URL을 입력
app.use(function(request, response, next) {
    response.status(404).send('Not Found');
});
// localhost:3000/page/CSS#@!#3312 과 같이 디렉토리에 없는 URL을 입력했을 때
app.use(function(err, request, response, next) {
    console.error(err.stack);
    response.status(500).send('Something broke!');
});


app.listen(port);