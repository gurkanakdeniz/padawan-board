var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.json(200, "return of the jedi");
});

module.exports = router;
