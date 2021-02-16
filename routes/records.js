const { response } = require("express");
var express = require("express");
var router = express.Router();
var Datastore = require("nedb");

router.all("*", (req, res, next) => {
  if (!req.cookies.user) {
    res.redirect("/users");
  } else {
    next();
  }
});

router.get(
  "/",
  function (req, res, next) {
    if (!req.query.id) {
      res.render("queryrecord", {
        message: req.query.message,
        details: req.query.details,
      });
    } else {
      next();
    }
  },
  function (req, res, next) {
    let patients = new Datastore({
      filename: `.data/${req.cookies.user}.db`,
      autoload: true,
    });
    patients.findOne({ id: req.query.id }, function (err, doc) {
      if (err) {
        console.log("error de database");
      } else if (!doc) {
        res.redirect(
          `/records/newrecord?id=${req.query.id}&message=info&details=newrecord`
        );
      } else {
        res.locals.paciente = doc;
        next();
        //res.render("record", doc);
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
        res.render('record', {...res.locals.paciente});
      }
    });
  }
);

router.get("/newrecord", function (req, res, next) {
  res.render("newrecord", {
    id: req.query.id,
    message: req.query.message,
    details: req.query.details,
  });
});

router.post(
  "/storerecord",
  function (req, res, next) {
    let patients = new Datastore({
      filename: `.data/${req.cookies.user}.db`,
      autoload: true,
    });
    patients.findOne({ id: req.body.id }, function (err, doc) {
      if (err) {
        console.log("Database error !");
      } else if (doc) {
        res.redirect("/records?message=warning&details=invalidrecord");
      } else {
        next();
      }
    });
  },
  function (req, res, next) {
    let patients = new Datastore({
      filename: `.data/${req.cookies.user}.db`,
      autoload: true,
    });
    let record = {
      id: req.body.id,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fdn: req.body.fdn,
      tel: req.body.tel,
      email: req.body.email,
      antecedentes: req.body.antecedentes,
      notas: [],
    };
    patients.insert(record, function (error, newRecord) {
      if (error) {
        console.log("Dabatase error");
      } else {
        res.redirect(`/records?id=${newRecord.id}`);
      }
    });
  }
);

router.post("/storenote", function (req, res, next) {
  let patients = new Datastore({
    filename: `.data/${req.cookies.user}.db`,
    autoload: true,
  });
  let nota = {
    stamp: Date.now(),
    enfactual: req.body.enfactual,
    exfisico: req.body.exfisico,
    excomple: req.body.excomple,
    enfactual: req.body.enfactual,
    diagnostico: req.body.diagnostico,
    tratamiento: req.body.tratamiento,
  };
  patients.update(
    { id: req.body.id },
    { $push: { notas: nota } },
    {},
    function (err) {
      if (err) {
        console.log("Database Error");
      } else {
        res.redirect(
          `/records?id=${req.body.id}&message=success&details=success`
        );
      }
    }
  );
});

module.exports = router;
