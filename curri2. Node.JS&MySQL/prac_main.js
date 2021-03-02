var http = require('http');
var url = require('url');
var topic = require('./lib_prac/topic');
var author = require('./lib_prac/author');

var app = http.createServer(function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        if (queryData.id === undefined) {
            topic.main(request, response);
        } else {
            topic.details(request,response);
    }
}
    // Create(topic)
    else if (pathname === '/create'){
        topic.create(request,response);
    }else if(pathname === '/process_create') {
        topic.process_create(request,response);
    }

    //Update & Read(topic)
    else if (pathname === '/update'){
        topic.update(request,response);
    } else if (pathname === "/process_update"){
        topic.process_update(request,response);
    }

    //Delete(topic)
    else if(pathname === "/process_delete"){
        topic.process_delete(request,response);
    }
    //author
    else if(pathname === '/author'){
        author.home(request,response);
    }
    else if (pathname ==='/author/create'){
        author.create(request,response);
    }
    else if(pathname==='/author/process_create')
    {
        author.process_create(request,response);
    }
    else if (pathname === '/author/update'){
        author.update(request,response);
    }
    else if (pathname ==='/author/process_update'){
        author.process_update(request,response);
    }
    else if (pathname === '/author/process_delete'){
        author.process_delete(request,response,queryData);
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);