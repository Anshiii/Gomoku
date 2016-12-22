/**
 * Created by Anshi on 2016/11/21.
 */

window.onload = function () {
  var board = null;
  var vue = new Vue({
    el: '#vueApp',
    data: {
      gameResult: null,
      canvas: {
        width: 550,
        height: 550,
        id: 'checkerboard'
      }
    },
    created: function (e) {
      console.log(e, this)
      board = new Checkerboard({
        canvas: this.canvas
      });

      this.desk = {
        pieces: board.pieces,
        players: board.players
      }
    },
    ready: function () {
      board.ready();
      board.offsetTop = board.dom.offsetTop + 20;
      board.offsetLeft = board.dom.offsetLeft + 20;
      this.gameResult = board.result;
    },
    methods: {
      addPiece: function (e) {
        //所有棋盘操作之前
        board.changePlayer();

        var event = {
          x: e.offsetX - board.offsetLeft,
          y: e.offsetY - board.offsetTop
        }
        if(board.getPieceCoords(event)){
          board.drawPiece();
          board.judgePieces();

        }
      }
    }
  });
}