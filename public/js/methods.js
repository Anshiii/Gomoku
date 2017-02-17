/**
 * Created by Anshi on 2017/1/5.
 */

var methods = {
  findPlayer: function () {
    var _this = this;
    //开始轮询,查找玩家,发送id。
    return $.ajax({
      url: '/player',
      method: 'GET',
      success: function (json) {
        if (json && json.stat == 1) {
          //找到了玩家
          var boardID = json.data.boardId;//获取棋盘ID,之后向棋盘发送操作
          //@todo 开始游戏的操作
        } else if (json.stat == -1) {
          //没找到玩家,继续发送请求
          return _this.findPlayer();
        }
      },
      fail: function (e) {
        //请求失败,400?500?还是没收到响应的失败?。。
        console.log(e)
      }
    })
  },
  stopFindPlayer:function (e) {
    e.abort();
  },
  addPiece:function () {
    $.ajax({
      url:'/addPiece',
      data:{},
      method:'POST',
      complete:function (e) {
        //获取反馈
        console.log(e)
      }
    })
  },
  undoPiece:function () {
    //data row,column,x,y,color,player(?)
    $.ajax({
      url:'/undoPiece',
      data:{},
      method:'DELETE',
      complete:function (e) {
        //
        console.log(e)
      }
    })
  }
}