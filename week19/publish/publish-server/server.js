let http = require('http');
let unzipper = require('unzipper');

//2.auth路由：接收code, 用code+client_id+client_secret换token

//4.publish路由：用token获取用户信息，检查权限，接收发布

http.createServer(function(request, response) {
    console.log("request")
        // let outFile = fs.createWriteStream("../server/public/tmp.zip");
        // request.pipe(outFile);
    request.pipe(unzipper.Extract({ path: '../server/public/' }));
}).listen(8082);