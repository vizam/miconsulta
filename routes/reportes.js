var express = require("express");
var router = express.Router();
var Datastore = require("nedb");
var nodemailer = require("nodemailer");

router.all("*", function (req, res, next) {
  if (!req.cookies.user) {
    res.render("login");
  } else {
    next("route");
  }
});

/**
 * View for sending email report
 * @params id: patient id
 * @params pagina: index of actual note
 * @params body contains Microsoft outlook/hotmail user and password
 */
router.post(
  "/:id/:pagina",
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
        //res.render('correo');
        next();
      }
    });
    //},
  /* function (req, res, next) {
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
  }, */
  },
  function (req, res, next) {
    var rendered;
    res.render("correo", function (err, html) {
      rendered = html;
    });
    var transporter = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
        user: req.body.usuario,
        pass: req.body.password
      },
    });
    var mailOptions = {
      from: req.body.usuario,
      to: req.body.destinatario,
      subject: "Informe de la consulta de urología",
      html: rendered,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send("ooops error");
      } else {
        console.log("Email sent: " + info.response);
        res.redirect(`/records?id=${req.params.id}&message=success&details=mailed`);
      }
    });
  }
);

module.exports = router;
