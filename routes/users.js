var express = require("express");
var router = express.Router();
var Datastore = require("nedb");

router.get("/", (req, res, next) => {
  if (!req.cookies.user) {
    res.render("login");
  } else {
    res.redirect("/records");
  }
});

router.get("/:msgtype/:msgdetails", (req, res, next) => {
  res.render("login", {
    messageType: req.params.msgtype,
    message: req.params.msgdetails,
  });
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.get("/register/:msgtype/:msgdetails", function (req, res, next) {
  res.render("register", {
    messageType: req.params.msgtype,
    message: req.params.msgdetails,
  });
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("user");
  res.render("login");
});

router.post("/login", function (req, res, next) {
  var users = new Datastore({ filename: "users.db", autoload: true });
  var email = req.body.email;
  var password = req.body.password;
  users.findOne({ email: email }, (err, doc) => {
    if (!doc) {
      res.redirect("/users/warning/noemail");
    } else if (password != doc.password) {
      res.redirect("/users/warning/wrongpass");
    } else {
      res.cookie("user", doc.email);
      res.redirect("/records/welcome/welcome");
    }
  });
});

router.post("/register", function (req, res, next) {
  if (req.body.code != "zv4p") {
    res.redirect("/users/register/warning/badcode");
  } else {
    next();
  }
});

router.post("/register", (req, res, next) => {
  var users = new Datastore({ filename: "users.db", autoload: true });
  var newUser = {
    email: req.body.email,
    password: req.body.password,
  };
  users.findOne({ email: newUser.email }, (err, doc) => {
    if (doc) {
      res.redirect("/users/register/warning/bademail");
    } else {
      next();
    }
  });
});

router.post("/register", (req, res, next) => {
  var users = new Datastore({ filename: "users.db", autoload: true });
  var user = {
    email: req.body.email,
    password: req.body.password,
  };
  users.insert(user, (err, newDoc) => {
    if (err) {
      res.redirect("/users/register/warning/error");
    } else {
      res.cookie("user", newDoc.email);
      res.redirect("/records/success/success");
    }
  });
});

module.exports = router;
