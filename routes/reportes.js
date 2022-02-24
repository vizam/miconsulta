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
 * Route for sending email report
 * @params id: patient id
 * @params pagina: index of actual note
 * @params body contains Microsoft outlook/hotmail user and password and
 *          firma as base64 string
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
        res.locals.firma = req.body.firma || '';
        //res.render('correo');
        next();
      }
    });
  },
  function (req, res, next) {
    res.render("correo", function (err, html) {
      if (err) {
        console.log(err);
      } else {
        res.locals.html = html;
        next();
        //res.render('correo');
      }
    });
  },
  function (req, res, next) {
    var transporter = nodemailer.createTransport({
      //service: "Hotmail",
      host: 'smtp-mail.outlook.com',
      port: 587,
      auth: {
        user: req.body.usuario,
        pass: req.body.password,
      },
    });
    var mailOptions = {
      from: req.body.usuario,
      to: req.body.destinatario,
      subject: "Informe de la consulta de urología",
      html: `<h1>IMPORTANTE:</h1>
            <p>Para óptimos resultados, <b>DESCARGUE</b> el archivo adjunto antes de abrirlo o imprimirlo</p>`,
      attachments: [
        {
          filename: "Resumen.html",
          content: res.locals.html
        },
      ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send("ooops error");
      } else {
        console.log("Email sent: " + info.response);
        res.redirect(
          `/records?id=${req.params.id}&message=success&details=mailed`
        );
      }
    });
  }
);

module.exports = router;
