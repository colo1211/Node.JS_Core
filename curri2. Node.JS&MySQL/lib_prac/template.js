module.exports={
    listMaker(topics){
        var list = `<ul>`;
        var i =0;
        while(i<topics.length){
            list+= `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i++;
        }
        list = list + `</ul>`;
        return list;
    },
    templateMaker(title, list, body, control){
        return `<!doctype html>
        <html>
        <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <a href="/author">author</a>
        ${list}
        ${control}
        <h2>${title}</h2>
        <p>${body}</p>
        </body>
        </html>`
    },
    authorList(authors){
        var tags = `<table>`;
        var i =0;
        while(i<authors.length) {
            tags = tags + `<tr>
                           <td>${authors[i].name}</td>
                           <td>${authors[i].profile}</td>
                           <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                           <td><form action="/author/process_delete" method="post">
                           <input type="hidden" name="id" value="${authors[i].id}">
                           <input type="submit" value="delete">
                           </form></td>
                           </tr> 
                           `
            i++;
        }
        tags+=`</table>`;
        return tags;
    }
}