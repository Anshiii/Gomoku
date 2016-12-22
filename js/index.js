/**
 * Created by Anshi on 2016/11/21.
 */

window.onload = function () {
  var board = null;
  var vue = new Vue({
    el: '#vueApp',
    data: {
      gameResult: {text: '', gameOver: false},
      canvas: {
        width: 550,
        height: 550,
        id: 'checkerboard',
        piecesID: 'pieces'
      },
      test: {}
    },
    //实例创建后调用
    created: function (e) {
      console.log(e, this)
      board = new Checkerboard({
        canvas: this.canvas
      });

    },
    ready: function () {
      board.ready();
      board.replay();
    },
    methods: {
      addPiece: function (e) {
        if (this.gameResult.gameOver) {
          return
        }
        //所有棋盘操作之前
        board.changePlayer();

        //20是棋盘固定的边
        var event = {
          x: e.offsetX - 20,
          y: e.offsetY - 20
        }
        if (board.getPieceCoords(event)) {
          board.drawPiece();
          board.judgePieces();
          if (board.result.gameOver !== this.gameResult.gameOver) {
            this.gameResult.gameOver = board.result.gameOver;
            this.gameResult.text = board.result.text;
          }
        }
        console.warn(board.pieces)

      },
      undoPiece: function () {
        //游戏结束后 也是不能悔棋的噢。。
        if (this.gameResult.gameOver) {
          return
        }
        //所有棋盘操作之前

        board.undoPiece();
        console.warn(board.pieces)

      },
      replay: function () {
        board.replay();
        console.warn(board.pieces)
      },
      testEvent: function () {
        board.result.text = "click result"
        board.result.text2 = "click result2"
        board.test.app = "clik test"
      }
    }
  });
}