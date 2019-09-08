const dbService = require("./board.db.service");
const passwordService = require("./password.service");
const uuidv4 = require("uuid/v4");

exports.saveBoard = async function(text, time, boardPass, socketId) {
  let uuid = await generateUUID();
  var hashPass = await passwordService.hashPassword(boardPass);
  var board = await dbService.insert(text, time, hashPass, socketId, uuid);
  if (board || Object.keys(board).length !== 0) {
    var response = { uuid: uuid, time: board.time };
    return response;
  }

  return "";
};

exports.getBoard = async function(uuid, password) {
  var board = await dbService.findByUUID(uuid);

  if (board || Object.keys(board).length !== 0) {
    var checkTime = await timeControl(board.time, board.createdDate);
    if (checkTime) {
      var checkPassword = await passwordService.checkPassword(
        password,
        board.pass
      );
      if (checkPassword) {
        var remainingTime = await getRemainingTime(
          board.time,
          board.createdDate
        );
        var response = { text: board.text, time: remainingTime, found: true };
        return response;
      }
    } else {
      var updatedBoard = await dbService.updateStatus(board, false);
    }
  }

  var notFound = {
    text: "there is something wrong or it is too late :/",
    time: 0,
    found: false
  };

  return notFound;
};

async function timeControl(time, createdDate) {
  var diff = new Date().getTime() - createdDate.getTime();
  var secondDiff = diff / 1000;
  return time > secondDiff;
}

async function getRemainingTime(time, createdDate) {
  var diff = new Date().getTime() - createdDate.getTime();
  var secondDiff = diff / 1000;
  return Math.round(time - secondDiff);
}

async function generateUUID() {
  var uuid = uuidv4();
  var arr = uuid.split("-");

  for (var i = 0; i < arr.length; i++) {
    var board = await dbService.findByUUID(arr[i]);
    if (!board || Object.keys(board).length === 0) {
      return arr[i];
    }
  }

  return uuid.replace(/-/g, "");
}
