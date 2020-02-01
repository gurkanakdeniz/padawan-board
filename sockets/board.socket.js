var boardController = require("../controllers/board.controller");

var counterList = {};
var getBoardCounterList = {};

exports.init = function(io, socket) {
  socket.on("saveBoard", function(data) {
    var response = boardController.save(data, socket);
    response.then(function(responseData) {
      if (responseData && responseData.success) {
        socket.emit("boardSaved", {
          data: {
            uuid: responseData.uuid,
            boardCountDown: responseData.boardCountDown
          }
        });

        if (counterList[socket.id]) {
          clearInterval(counterList[socket.id]);
        }

        var time = responseData.boardCountDown;
        const counter = setInterval(() => {
          time = time - 1;
          socket.emit("boardCountDown", {
            data: {
              boardCountDown: time
            }
          });
          if (time <= 0) {
            clearInterval(counter);
          }
        }, 1000);

        counterList[socket.id] = counter;
      }
    });
  });

  socket.on("getBoard", function(data) {
    var response = boardController.get(data);
    response.then(function(responseData) {
      if (responseData && responseData.success) {
        socket.emit("getBoardResult", {
          data: {
            board: responseData.board,
            boardCountDown: responseData.boardCountDown
          }
        });

        if (getBoardCounterList[socket.id]) {
          clearInterval(getBoardCounterList[socket.id]);
        }

        if (responseData.found) {
          var time = responseData.boardCountDown;
          const counter = setInterval(() => {
            time = time - 1;
            socket.emit("getBoardCountDown", {
              data: {
                boardCountDown: time
              }
            });
            if (time <= 0) {
              clearInterval(counter);
            }
          }, 1000);

          getBoardCounterList[socket.id] = counter;
        }
      }
    });
  });

  socket.on("disconnect", function(data) {
    console.log("disconnect jedi! : " + socket.id);
    if (getBoardCounterList[socket.id]) {
      clearInterval(getBoardCounterList[socket.id]);
    }
  });
};
