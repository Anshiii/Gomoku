/**
 * Created by Anshi on 2016/12/23.
 */
var http = require('http')
var url = require('url')
var express = require('express')
//中间件
var cookieParser = require('cookie-parser');
var session = require('express-session');//默认使用内存存放session(?)
var bodyParser = require('body-parser')


// var session = require('session')
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
const uuidV1 = require('uuid/v1')

//略过数据库
var initData = function (name, pw) {
  pw = pw || '';
  return {un: name, pw: pw, win_percentage: '0%', total_num: '0'}
}
var user = {
  '233': {un: '233', pw: '233', win_percentage: '57.89%', total_num: '233', cls: 'guest'},
  '466': {un: '466', pw: '466', win_percentage: '62.89%', total_num: '233', cls: 'user'},
  'unknow': {un: 'anshi', pw: '111', win_percentage: '11.1%', total_num: '33', cls: 'guest'}
}

//1:登录,ok;-1:未登录;2:重复登录

var sessionData = {};//@todo session的数据结构应该啥样呢


app.use(express.static(__dirname + '/public')) //相对静态目录查找的文件
app.use(cookieParser())
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: {maxAge: 60 * 1000 * 10}
}))


//打开主页
app.get('/goLang', function (req, res) {
  console.log(__dirname) //根路径/Users/Anshi/WebstormProjects/Train/goLang
  //req.sessionID = session.id
  //*来的cookie带sid 中间件就能使req获得对应的session对象,和对应的状态*
  if (req.session.isVisit) {
    req.session.isVisit++;
  } else {
    req.session.isVisit = 1;
    console.log(req.session);
  }
  res.sendFile(__dirname + '/index.html')

})

//检查登录状态
app.get('/goLang/user', function (req, res) {
  //存在cookie
  var loginid = req.session.login__identify;
  if (req.session.login__identify === 1&& req.session.username) {
    var userData = user[req.session.username];
    var resData = {
      name: userData.un,
      win_percentage: userData.win_percentage,
      total_num: userData.total_num
    }
    res.send({stat: 1, mgs: '登录成功', data: resData});
  } else {
    res.send({stat: -1, msg: '未登录'})
  }
})
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})
//用户登录
app.post('/goLang/user', urlencodedParser, function (req, res) {
  //@todo 话说这里 如果是已经登录的状态,又过来调用这个接口呢?
  //拿到用户名后验证密码。(@todo 这里是否需要对输入框内容进行过滤
  if (!req.body) return res.sendStatus(400)
  //查找这个用户名的数据有木有
  var un = req.body.un;
  var pw = req.body.pw;
  if (!un || !pw) return res.send({stat: -1, msg: '用户名或密码不能为空'})
  if (!user[un]) return res.send({stat: -1, msg: '用户名或密码错误'})
  if (user[un].pw === pw) {
    req.session.login__identify = 1;//登录成功,用户类型为帐号注册。>>>什么时候删掉这个状态?自定义存多久吧。。。
    req.session.username = un;
    res.send({stat: 1, mgs: '登录成功'});
  }
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body

})


//游客登录
app.post('/goLang/guest', function (req, res, next) {
  //点击游客登录,返回基本信息。
  if (req.session.login__identify === -1) {
    var guestname = `guest${uuidV1()}`;
    var newData = initData(guestname) //sessionid不能暴露。。
    user[guestname] = newData;
    req.session.login__identify = 1;//登录状态,游客登录
    req.session.username = guestname;
        res.send({stat: 1, msg: 'new guest settle', data: newData})
  } else {
    res.send({stat: 2, msg: '游客登录失败', data: null})
  }
  next();
})

//用户注册
app.post('/goLang/register', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  var un = req.body.un;
  var pw = req.body.pw;
  if (user[un]) return res.send({stat: -1, msg: '重复的用户名'})//不存在的用户名---@todo 有些网站表示用户名或密码错误(?)
  if (!un || !pw) return res.send({stat: -1, msg: '用户名或密码不能为空'})
  user[un] = initData(un, pw);
  req.session.login__identify = 1;//注册后保持登录状态。
  req.session.username = un;
  res.send({stat: 1, msg: '注册成功'})
})

app.get('/goLang/newGame', function (req, res) {

})
app.post('/piece', function () {

})
app.delete('/piece', function () {

})
//所有404页面处理
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

var a = 1;
io.on('connection', function (socket) {

  console.log(socket);
  socket.on('pieces', function (action) {
    console.log('action', typeof action)
    //收到a的动作,给a和b发送反馈。。。
    io.emit('pieces', action)
  })

  socket.on('disconnect', function (msg) {
    console.log(msg + '下缐了')
  })
  
  //加入游戏
  socket.on('joinRoom',function (socket) {
    console.log(socket)
  })
});

// app.listen(7788)
// server.listen(app.get('7788')); // not 'app.listen'!
server.listen(7788, function () {
  console.log('监听端口7788');
});
