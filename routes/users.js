var express = require("express");
var router = express.Router();
var Datastore = require("nedb");



router.get("/", (req, res, next) => {
  if (!req.cookies.user) {
    res.render("login", {
      message: req.query.message,
      details: req.query.details
    });
  } else {
    res.redirect("/records?message=welcome&details=welcome");
  }
});

router.get("/register", function (req, res, next) {
  res.render("register", {
    message: req.query.message,
    details: req.query.details
  });
});


router.get("/logout", (req, res, next) => {
  res.clearCookie("user");
  res.render("home");
});

router.post(
  "/login",
  function (req, res, next) {
    var users = new Datastore({ filename: ".data/users.db", autoload: true });
    users.findOne({ user: req.body.user }, function (err, doc) {
      if (err) {
        console.log("error de database");
      } else if (!doc) {
        res.redirect("/users?message=warning&details=noemail");
      } else if (req.body.password != doc.password) {
        res.redirect("/users?message=warning&details=wrongpass");
      } else {
        next();
      }
    });
  },
  function (req, res, next) {
    res.cookie("user", req.body.user, {httpOnly: true});
    res.redirect("/records?message=welcome&details=welcome");
  }
);

router.post("/register",
  function (req, res, next) {
    if (req.body.code != "zv4p") {
      res.redirect("/users/register?message=warning&details=badcode");
    } else {
      next();
    }
  },
  function (req, res, next) {
    var users = new Datastore({ filename: ".data/users.db", autoload: true });
    var newUser = {
      user: req.body.email,
      password: req.body.password,
    };
    users.findOne({ user: newUser.email }, (err, doc) => {
      if (doc) {
        res.redirect("/users/register?message=warning&details=bademail");
      } else {
        next();
      }
    });
  },
  function (req, res, next) {
    var users = new Datastore({ filename: ".data/users.db", autoload: true });
    var newUser = {
      user: req.body.email,
      password: req.body.password,
    };
    users.insert(newUser, (err, newDoc) => {
      if (err) {
        console.log("error de database");
      } else {
        res.cookie("user", newDoc.user, {httpOnly: true});
        res.redirect("/records");
      }
    });
  }
);


module.exports = router;
