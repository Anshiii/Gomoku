/**
 * Created by Anshi on 2016/12/20.
 */
//@function 构造函数棋子。
function Piece(obj) {
  this.color = obj.color; //颜色
  this.x = obj.x; //坐标
  this.y = obj.y; //坐标
  this.row = obj.row;
  this.column = obj.column;
  this.player = obj.player;
  //常数
  this.SIZE = 15; //直径15呗

}
Piece.prototype = {
  checkerboard: null,
  //@argument 需要绘制的画板。
  drawPiece: function (ctx) {
    ctx.arc(this.x, this.y, this.SIZE, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
  },
  setPiecesStyle: function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
  },
  //@function 删除这个棋子?撤销?。。。
  deletePieces: function () {

  },
  selected: function () {
    this.disabled = false; //被选中啦
  }
}

//@function 构造函数玩家。
function Player(idx, pieces) {
  this.index = idx;
  this.pieces = pieces; //为什么参数 指向的是同一个数组对象?
  this.color = idx === 0 ? 'black' : 'red';
}
Player.prototype = {
  addPiece: function (column, row, obj) {
    this.pieces[column][row] = obj;
  },
  deletePiece: function () {

  }
}

//@function 构造函数棋盘。
//@argument {canvas:{width:,height:,id},playerNum:2}
function Checkerboard(obj) {
  //常量
  this.GRID = 40; //每一格子的宽度
  this.MAXLINE = 5; //最大连线数
  this.PLAYERNUM = 2; //默认两玩家

  this.linesNum = {
    row: Math.floor((obj.canvas.width - 40) / this.GRID),
    column: Math.floor((obj.canvas.height - 40) / this.GRID)
  }
  this.width = this.linesNum.row * this.GRID;
  this.height = this.linesNum.column * this.GRID;
  this.id = obj.canvas.id

  this.pieces = this.create2DArray(this.linesNum.column + 1, this.linesNum.row + 1); //初始化二维数组棋盘
  this.currentPiece = null; //当前棋子

  this.players = new Array(this.PLAYERNUM); //所有玩家 //默认为2?
  this.currentPlayer = null; //默认初始的当前玩家是idx0的玩家

  this.result = null;//游戏结果指针
}

Checkerboard.prototype = {
  //@function 基础操作。
  //@argument
  ready: function () {
    this.getContext();
    this.drawCheckerboard();
    this.initPlayers();
  },
  //@function 初始化所有棋子
  //@argument
  create2DArray: function (col) {
    var arr = [];
    arr = new Array(col); //所有棋子
    for (let i = 0; i < arr.length; i++) {
      arr[i] =[];
    }
    return arr;
  },
  initPlayers: function () {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i] = new Player(i, this.create2DArray(this.linesNum.column + 1, this.linesNum.row + 1))
    }
  },
  //@function 获取绘制上下文。
  getContext: function () {
    this.dom = document.getElementById(this.id);
    this.context = this.dom.getContext("2d");
  },
  //@function 画棋盘。
  //@argument
  drawCheckerboard: function () {
    this.context.lineWidth = 4;
    this.context.strokeStyle = 'rgba(255,0,0,0.5)';
    this.context.translate(20, 20)
    this.context.strokeRect(0, 0, this.width, this.height)

    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'rgb(25,25,25)';
    //画竖线
    for (let i = this.linesNum.row - 1; i > 0; i--) {
      this.context.moveTo(this.GRID * i, 0);
      this.context.lineTo(this.GRID * i, this.height);
      this.context.fillText(i, this.GRID * i, -5);
    }
    //画横线
    for (let i = this.linesNum.column - 1; i > 0; i--) {
      this.context.moveTo(0, this.GRID * i);
      this.context.lineTo(this.width, this.GRID * i);
      this.context.fillText(i, -10, this.GRID * i);
    }
    this.context.stroke();
    this.context.closePath();
  },

  //@function 画棋子。
  //@argument  {colors:,coords:,Checkerboard:}
  drawPiece: function () {
    this.currentPiece.setPiecesStyle(this.context)
    this.currentPiece.drawPiece(this.context)
  },
  //@function 根据点击的位置(以[棋盘]的左上角为原点,接受负值噢,毕竟还有边线)判断棋子的位置。
  //@argument  x,y
  //@return  返回布尔值,true代表当前可以下子,false代表当前已经有棋子了
  getPieceCoords: function (event) {
    //接受到的坐标 属于哪个点的 + — 20范围内呢,重合则默认选左上
    var row = Math.round(event.x / this.GRID);
    var column = Math.round(event.y / this.GRID);
    if (this.pieces[column][row] || row > this.linesNum.row || column > this.linesNum.column) {
      return false
    }
    //@todo 上面二者需要判断一下row和col是否合法噢。[在canvas范围但是不在棋盘范围]
    var x = row * this.GRID;
    var y = column * this.GRID;
    this.pieces[column][row] = {
      color: this.currentPlayer.color,
      x: x,
      y: y,
      row: row,
      column: column,
      player: this.currentPlayer
    }

    var constructPiece = new Piece(this.pieces[column][row]);
    this.currentPlayer.addPiece(column, row, this.pieces[column][row]);
    this.currentPiece = constructPiece;
    return true
  },
  changePlayer: function () {
    if (this.currentPlayer === this.players[0]) {
      this.currentPlayer = this.players[1]
    } else {
      this.currentPlayer = this.players[0]
    }
  },
  judgePieces: function () {
    var allPossible = ['col', 'row', 'leftSla', 'rightSla'];
    var _this = this;
/*    console.warn(this.currentPlayer.pieces)
    console.warn(this.currentPlayer)*/

    allPossible.forEach(function (item) {
      var point = _this.findLind(item);
      if (point >= 5) {
        _this.gameOver();
        return false;
      }
    })
  },
  findLind: function (direction) {
    var row = this.currentPiece.row;
    var column = this.currentPiece.column;
    var pieces = this.currentPlayer.pieces;
    var basePoint = 1;
    switch (direction) {
      case 'col':
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column + i][row]) {
            basePoint++
          } else {
            break
          }
        }
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column - i][row]) {
            basePoint++
            if (basePoint === 5) {
              break
            }
          } else {
            break
          }
        }
        break;
      case 'row':
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column][row + i]) {
            basePoint++
          } else {
            break
          }
        }
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column][row - i]) {
            basePoint++
            if (basePoint === 5) {
              break
            }
          } else {
            break
          }
        }
        break;
      case 'leftSla':
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column - i][row - i]) {
            basePoint++
          } else {
            break
          }
        }
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column + i][row + i]) {
            basePoint++
            if (basePoint === 5) {
              break
            }
          } else {
            break
          }
        }
        break;
      case 'rightSla':
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column - i][row + i]) {
            basePoint++
          } else {
            break
          }
        }
        for (let i = 1; i < this.MAXLINE; i++) {
          if (pieces[column + i][row - i]) {
            basePoint++
            if (basePoint === 5) {
              break
            }
          } else {
            break
          }
        }
        break;
    }
    return basePoint;
  },
  gameOver: function () {
    //取消点击事件
    //弹出提示,公布结果
    this.result = this.currentPlayer; //赢家对象
    console.log("result赋值了啊。。gameresult不跟着变吗")
  }
}