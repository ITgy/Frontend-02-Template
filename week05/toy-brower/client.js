const net = require("net");
const parser = require("./parser4.js");
const images = require("images");
const render = require("./render.js");

class Request {
    constructor(options) {
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.method = options.method || "GET";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.parse(JSON.stringify(this.body));
        } else {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', data => {
                console.log(data.toString());
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            })
            connection.on('error', err => {
                reject(err);
                connection.end();
            })
        })
    }

    toString() {
            return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r\n\r\n${this.bodyText}`;
    }
}

class ResponseParser{
  constructor(){
    this.WAIT_STATUS_LINE = 0;
    this.WAIT_STATUS_LINE_END = 1;
    this.WAIT_HEADER_NAME = 2;
    this.WAIT_HEADER_SPACE = 3;
    this.WAIT_HEADER_VALUE = 4;
    this.WAIT_HEADER_LINE_END = 5;
    this.WAIT_HEADER_BLOCK_END = 6;
    this.WAIT_BODY = 7;

    this.current = this.WAIT_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response(){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    console.log(RegExp.$1)
    console.log(RegExp.$2)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive(string){
    for(let i=0;i<string.length;i++){
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char){
    if(this.current === this.WAIT_STATUS_LINE){
      if(char === "\r"){
        this.current = this.WAIT_STATUS_LINE_END;
      } else {
        this.statusLine += char
      }
    } else if(this.current === this.WAIT_STATUS_LINE_END){
      if(char === "\n"){
        this.current = this.WAIT_HEADER_NAME;
      } 
    } else if(this.current === this.WAIT_HEADER_NAME){
      if(char === ":"){
        this.current = this.WAIT_HEADER_SPACE;
      } else if(char === "\r"){
        this.current = this.WAIT_HEADER_BLOCK_END;
        if(this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char
      }
    } else if(this.current === this.WAIT_HEADER_SPACE){
      if(char === " "){
        this.current = this.WAIT_HEADER_VALUE;
      }
    } else if(this.current === this.WAIT_HEADER_VALUE){
      if(char === "\r"){
        this.current = this.WAIT_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char
      }
    } else if (this.current === this.WAIT_HEADER_LINE_END){
      if(char === "\n"){
        this.current = this.WAIT_HEADER_NAME;
      }
    } else if(this.current === this.WAIT_HEADER_BLOCK_END){
      if(char === "\n"){
        this.current = this.WAIT_BODY
      }
    } else if(this.current === this.WAIT_BODY){
      this.bodyParser.receiveChar(char);
    }
  }
}

class TrunkedBodyParser{
  constructor(){
    this.WAIT_LENGTH = 0;
    this.WAIT_LENGTH_LINE_END = 1;
    this.READ_TRUNK = 2;
    this.WAIT_NEW_LINE = 3;
    this.WAIT_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAIT_LENGTH;
  }

  receiveChar(char){
    if(this.current === this.WAIT_LENGTH){
      if(char === '\r'){
        if(this.length === 0){
          this.isFinished = true;
        }
        this.current = this.WAIT_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16)
      }
    } else if (this.current === this.WAIT_LENGTH_LINE_END){
      if(char === '\n'){
        this.current = this.READ_TRUNK;
      }
    } else if (this.current === this.READ_TRUNK){
      this.content.push(char);
      this.length--;
      if(this.length === 0){
        this.current = this.WAIT_NEW_LINE;
      }
    } else if (this.current === this.WAIT_NEW_LINE){
      if(char === '\r'){
        this.current = this.WAIT_NEW_LINE_END;
      }
    } else if (this.current === this.WAIT_NEW_LINE_END){
      if(char === '\n'){
        this.current = this.WAIT_LENGTH;
      }
    }
  }
}


void async function() {
    let request = new Request({
        host: '127.0.0.1',
        port: 8082,
        path: '/',
        method: 'POST',
        headers: {
            ["x-Foo2"]: "customed"
        },
        body: {
            name: 'ITGY'
        }
    });

    let response = await request.send();
    console.log(response);
    let dom = parser.parseHTML(response.body);

    let viewport = images(1920, 1080);
    viewport.fill(255,255,255);
    render(viewport, dom.children[0].children[2].children[1]);
    viewport.save('viewport.jpg');
}()