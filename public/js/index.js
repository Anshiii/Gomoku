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
        piecesID: 'pieces' //棋子层面的canvas
      }
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
        //20是棋盘固定的边
        var event = {
          x: e.offsetX - 20,
          y: e.offsetY - 20
        }
        board.addPiece(event)
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
      newGame: function () {

      }
    }
  });
}