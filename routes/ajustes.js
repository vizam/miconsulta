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
  users.findOne({ user: req.cookies.user }, function (err, doc) {
    if (err) {
      console.log("se produjo un error de database");
    } else {
      res.render('ajustes', doc)
    }
  });
});

router.post("/dataprofesional", function (req, res, next) {
  let users = new Datastore({
    filename: `.data/users.db`,
    autoload: true,
  });
  users.findOne({ user: req.cookies.user }, function (err, doc) {
    if (err) {
      console.log('error de database');
    } else {
      let data = {
        grado: req.body.grado,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        especialidad: req.body.especialidad,
        credencial1: req.body.credencial1,
        credencial2: req.body.credencial2,
        credencial3: req.body.credencial3,
      };
      users.update(
        { user: req.cookies.user },
        { $set: {...data } },
        {},
        function (err) {
          if (err) {
            console.log('error de database');
          } else {
            res.send({ ...data,  message: "success", details: "success" });
          }
        }
      );
    }
  });
});


module.exports = router;
