
var fs = require('fs')
var url = require('url')

function handler(request,response) {
var pathname = request.url;
  
  
  switch (request.url){
    case '/goLang':
        fs.readFile('./index.html',"utf-8",(err,data)=>{
          if (err) throw err;
          response.writeHead(200,{"Content-Type":"text/html;charset=utf-8","Content-Length":"1565"})
          response.write(data)
          response.end()
        })
      break
    case '/style/index.css':
      fs.readFile('/style/index.css',"utf-8",(err,data)=>{
        if (err) throw err;
        response.writeHead(200,{"Content-Type":"text/css","Content-Length":"1511"})
        response.write(data)
        response.end()
      })
      break
    case '/js/vue.js':
      fs.readFile('/js/vue.js',"utf-8",(err,data)=>{
        if (err) throw err;
        response.writeHead(200,{"Content-Type":"application/javascript","Content-Length":"272862"})
        response.write(data)
        response.end()
      })
      break
  }
}

exports.route = handler;