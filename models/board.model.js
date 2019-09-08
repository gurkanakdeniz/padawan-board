const mongoose = require("mongoose");

const board = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  text: { type: String },
  time: { type: Number, default: 60 },
  pass: { type: String },
  socketId: { type: String },
  uuid: { type: String },
  status: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("board", board);
