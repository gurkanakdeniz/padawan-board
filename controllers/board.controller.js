var BoardService = require("../services/board.service");

exports.save = async function(data, socket) {
  var board = data.board;
  var boardTime = data.boardTime;
  var boardPassword = data.boardPassword ? data.boardPassword : "42";
  var socketId = socket.id;

  var serviceResponse = await BoardService.saveBoard(
    board,
    boardTime,
    boardPassword,
    socketId
  );
  if (serviceResponse) {
    var response = {
      uuid: serviceResponse.uuid,
      boardCountDown: serviceResponse.time,
      success: true
    };
    return response;
  }

  return "";
};

exports.get = async function(data) {
  var uuid = data.uuid;
  var boardPassword = data.boardPassword ? data.boardPassword : "42";

  var serviceResponse = await BoardService.getBoard(uuid, boardPassword);
  if (serviceResponse) {
    var response = {
      uuid: uuid,
      board: serviceResponse.text,
      boardCountDown: serviceResponse.time,
      found: serviceResponse.found,
      success: true
    };
    return response;
  }

  return "";
};
