module.exports= {
    templateTxt(title, list, body, control) { // 화면에 출력할 template을 만들어 주는 함수
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">Hello WEB World</a></h1>
        ${list}    
<!--        <a href="/create">create</a> <a href = '/update'>update</a>-->
        ${control}
        ${body}
        </body>
        </html>
     `;
    },
    listMaker(fileName) { // 파일 리스트를 만들어 주는 함수
        var list = `<ul>`;
        var i = 0;
        while (i < fileName.length) {
            list = list + `<li><a href="/?id=${fileName[i]}">${fileName[i]}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }
};