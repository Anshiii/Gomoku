/**
 * Created by Anshi on 2016/12/23.
 */
var http = require('http')
var url = require('url')
var handler = require('./src/handler')
var express = require('express')
var app = express()

app.use(express.static(__dirname +'/public')) //相对静态目录查找的文件


app.get('/goLang',function (req,res) {
  
  console.log(__dirname ) //根路径/Users/Anshi/WebstormProjects/Train/goLang
  res.sendFile(__dirname + '/index.html')
})
app.get('/goLang/newGame',function (req,res) {

})
app.listen(7788)