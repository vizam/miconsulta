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

/**
 * View for printing a report
 * @params id: patient id
 * @params pagina: index of actual note
 */
router.get(
  "/:id/:pagina/:destino",
  function (req, res, next) {
    let pacientes = new Datastore({
      filename: `.data/${req.cookies.user}.db`,
      autoload: true,
    });
    pacientes.findOne({ id: req.params.id }, function (err, doc) {
      if (err) {
        console.log("error de database");
      } else {
        let nota = doc.notas[req.params.pagina];
        delete doc.notas;
        res.locals.paciente = { ...doc, ...nota };
        next();
      }
    });
  },
  function (req, res, next) {
    let usuarios = new Datastore({
      filename: ".data/users.db",
      autoload: true,
    });
    usuarios.findOne({ user: req.cookies.user }, function (err, doc) {
      if (err) {
        console.log("se produjo un error de database");
      } else {
        res.locals.doctor = doc;
        //res.render('informe');
        next();
      }
    });
  },
  function (req, res, next) {
    if (req.params.destino == 'printer') {
      res.render('informe');
    } else {
      res.send('entonces vmaqos al correo !');
    }
  }
);

module.exports = router;
