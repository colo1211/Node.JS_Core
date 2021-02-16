var http = require('http');
var fs = require('fs');
var url = require('url');

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

                var list = `<ul>`;
                var i=0;
                while(i<fileName.length){
                    list = list + `<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
                    i++;
                }
                list = list+`</ul>`;
                var template = `
               <!doctype html>
                <html>
                <head>
                  <title>${title}</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                  ${list}  
                  <h2>${title}</h2>
                  <p>${description}</p>
                </body>
                </html>
            `;
                response.writeHead(200);
                response.end(template);
            })
        }else { // main 페이지가 아닌 다른 페이지
            var title = queryString.id;

            // 실수한 부분 - readFile에서 파일위치만 명시하고 파일 명을 빼먹음
            fs.readFile(`./data/${queryString.id}`,'utf8',function (error, description){
                fs.readdir(`./data`,function (error,fileName){
                    if (!fileName.includes(queryString.id)) {
                        response.writeHead(404);
                        response.end(`Not Found`);
                    }
                    else {
                        var list = `<ul>`;
                        var i = 0;
                        while (i < fileName.length) {
                            list = list + `<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
                            i++;
                        }
                        list = list + `</ul>`;

                        var template =
                            `<!doctype html>
                        <html>
                        <head>
                            <title>${title}</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <p>${description}</p>
                        </body>
                        </html>`;
                        response.writeHead(200);
                        response.end(template)
                    }
                })

            });

            }
    }else{ // 아예 이상한 URL
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);
