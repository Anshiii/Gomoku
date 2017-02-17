/**
 * Created by Anshi on 2016/11/21.
 */

window.onload = function () {
  $('#pieces').on('click', function (e) {
    var event = {
      x: e.offsetX - 20,
      y: e.offsetY - 20
    }
    socket.emit('pieces', {class: 'add', position: event})
    //发送后本地即时反馈(如果后期请求超时或失败怎么解决?
  })
  socket.on('pieces', function (msg) {
    switch (msg.class) {
      case 'add':
        console.log('add', msg)
        break
      case 'undo':
        console.log('undo', msg)
    }
  })
  var board = null;
  var vue = new Vue({
    el: '#vueApp',
    data: {
      gameResult: {text: '', gameOver: false},
      canvas: {
        width: 520,
        height: 520,
        id: 'checkerboard',
        piecesID: 'pieces' //棋子层面的canvas
      },
      user: {}
    },
    //实例创建后调用
    created: function (e) {
      console.log(e, this)
      board = new Checkerboard({
        canvas: this.canvas
      });
      this.getLoginStat()

    },
    ready: function () {
      board.ready();
      board.replay();

    },
    methods: {
      addPiece: function (e) {
        //20是棋盘固定的边
        var event = {
          x: e.offsetX - 20,
          y: e.offsetY - 20
        }
        board.addPiece(event)

        //获取下子后当前战况
        if (board.result.gameOver != this.gameResult.gameOver) {
          this.gameResult.gameOver = board.result.gameOver;
          this.gameResult.text = board.result.text;
        }
      },
      undoPiece: function () {
        //游戏结束后 也是不能悔棋的噢。。
        if (!this.gameResult.gameOver) {
          board.undoPiece();
        }
      },
      replay: function () {
        board.replay();
        console.warn(board.pieces);
        this.gameResult.gameOver = board.result.gameOver;
        this.gameResult.text = board.result.text;
      },
      joinRoom:function () {
        //规定收到一个 {roomid}
        var socket = io();

        socket.emit('joinRoom')

        //页面暂停。
        socket.on('joinRoom Ok',function (msg) {
          socket.join
          location.href = "/room"+msg.roomId;
        })
        
      },
      newGame: function () {
      },
      guestLogin: function () {
        //告诉服务器 生成一个游客的sessionId来。 放在cookie里。
        $.ajax({
          url: '/goLang/guest',
          method: 'GET',
          success: function (json) {
            if (json && json.stat === 1) {
              //生成sessionId 了,存在cookie里。
              document.cookie = json.data.cookie;
            }
          }
        })

      },
      /*getNameFromCookie: function () {
       var _this = this;
       _this.user.signIn = false;
       //{sessionId:adswdsxzczxc}

       //手动添加cookie测试
       document.cookie = 'session=2333';
       $.ajax({
       async: false,
       url: '/goLang/user',
       method: 'GET',
       success: function (json) {
       if (json && json.stat === 1&&json.data) {
       //用户存在, 登录ok
       _this.user = json.data;//获取一些用户信息以展示
       _this.user.signIn = true;
       }
       }
       })
       },*/
      getLoginStat: function () {
        var _this = this;

        $.ajax({
          url: '/goLang/user',
          method: 'GET',
          success: function (json) {
            if (json && json.stat === 1 && json.data) {
              _this.user = json.data;
              _this.user.signIn = true;
            }
          }
        })
      },
      login: function (e) {
        event.preventDefault();

        var _this = this;
        var data = {
          un: $('#pro-un').val(),
          pw: $('#pro-pw').val()
        }
        if (!data.un || !data.pw) {
          //帐号或密码不能为空。
          return "帐号或密码不能为空"
        }
        $.ajax({
          url: '/goLang/user',
          method: 'POST',
          data: data,
          success: function (json) {
            if (json && json.stat === 1) {
              //登录成功,拿到指定的 用户数据。渲染
              location.reload();

            }
          }
        })
      },
      register: function () {
        //输入注册帐号密码登录
        var data = {
          un: $('#pro-un').val(),
          pw: $('#pro-pw').val()
        }
        if (!data.un || !data.pw) {
          //帐号或密码不能为空。
          return "帐号或密码不能为空"
        }
        $.ajax({
          url: '/goLang/register',
          method: 'POST',
          data: data,
          success: function (json) {
            if (json && json.stat === 1) {
              location.reload();
            }
          }
        })
      }
    }
  });
}