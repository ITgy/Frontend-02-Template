const http = require("http");

const server = http.createServer((request, response) => {
    let body = "";
    request.on('error', err => {
        console.log(err);
    }).on("data", chunk => {
        body += chunk;
    }).on("end", () => {
        let dataStr = body.toString();
        console.log("======");
        console.log(dataStr);
        console.log("======");
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`<html maaa=a >
        <head>
        <style>
        .container {
            width: 500px;
            display: flex;
            flex-wrap: wrap;
            background-color: rgb(240,128,128);
        }
        
        .container .abc {
            width: 400px;
            height: 200px;
            background-color: rgb(173,216,230);
        }
        
        .container #def {
            width: 200px;
            height: 200px;
            background-color: rgb(144,238,144);
        }
        
        .container #ghi {
            width: 500px;
            height: 200px;
            background-color: rgb(32,178,170);
        }
        
        .container #jkl {
            width: 300px;
            height: 200px;
            background-color: rgb(255,160,122);
        }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="abc"></div>
            <div id="def"></div>
            <div id="ghi"></div>
            <div id="jkl"></div>
        </div>
        </body>
        </html>`)
    })
}).listen(8082, () => {
    console.log("服务已启动,端口号：8082")
})