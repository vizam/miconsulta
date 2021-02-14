var express = require("express");
var router = express.Router();
var Datastore = require("nedb");

router.all("*", function (req, res, next) {
  if (!req.cookies.user) {
    res.render("login");
  } else {
    next("route");
  }
});

router.get("/", function (req, res, next) {
  let users = new Datastore({
    filename: `.data/users.db`,
    autoload: true,
  });
  users.findOne({ email: req.cookies.user }, function (err, doc) {
    if (err) {
      console.log("se produjo un error de database");
    } else {
      res.render('ajustes', doc)
    }
  });
});

module.exports = router;
