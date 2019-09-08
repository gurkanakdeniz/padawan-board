const createError = require("http-errors");
var express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
var io = require("socket.io")();
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.io = io;

mongoose
  .connect(
    "mongodb://localhost/padawanboard",
    { useNewUrlParser: true }
  )
  .then(db => console.log("db connected"))
  .catch(err => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * sockets
 */
var boardSocket = require("./sockets/board.socket");
io.on("connection", function(socket) {
  console.log("one more jedi! : " + socket.id);
  boardSocket.init(io, socket);
});

/**
 * routers
 */
var indexRouter = require("./routes/index");
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
