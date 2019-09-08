const mongoose = require("mongoose");
const boardModel = require("../models/board.model");

exports.findById = async function(id) {
  return boardModel.findOne({ _id: id });
};

exports.findByUUID = async function(uuid) {
  return boardModel.findOne({ uuid: uuid, status: true });
};

exports.insert = async function(text, time, boardPass, socketId, uuid) {
  const model = new boardModel({
    _id: new mongoose.Types.ObjectId(),
    text: text,
    time: time,
    pass: boardPass,
    socketId: socketId,
    uuid: uuid
  });
  var response = await model.save();
  return response;
};

exports.updateStatus = async function(model, status) {
  model.status = status;
  var response = await model.save();
  return response;
};
