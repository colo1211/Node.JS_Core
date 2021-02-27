var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
        if (queryData.id === undefined) {
            topic.home(request, response);
        } else {
            topic.description(request,response,queryData);
        }
    }else if (pathname === '/create') {
            topic.create(request,response);
    }else if(pathname === '/process_create'){
        topic.process_create(request,response);
    }else if(pathname === '/update'){
        topic.update(request,response,queryData);
    }else if(pathname === '/update_process'){
        topic.process_update(request,response)
    } else if(pathname === '/delete_process'){
        topic.process_delete(request,response);
    } else if (pathname === '/author'){
       author.home(request,response);
    } else if (pathname === '/author/create'){
        author.create(request,response);
    } else if (pathname === '/author/update'){
        author.update(request,response,queryData);
    }else if (pathname ==='/author/update_process'){
        author.process_update(request,response);
    }
    else if (pathname ==="/author/delete_process"){
        author.process_delete(request,response,queryData);
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);