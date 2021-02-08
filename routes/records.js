var express = require('express');
var router = express.Router();



router.get('/', (req, res, next) => {
  if (!req.cookies.user) {
    res.render('login');
    return;
  }
  if (!req.query.id) {
    res.render('queryrecord');
    return;
  }
  next();
});

router.get('/', (req, res, next) => {
  if (!req.cookies.user) {
    res.render('login');
    return;
  }
  let Datastore = require('nedb');
  let patients = new Datastore({ filename: `${req.cookies.user}.db`, autoload: true });
  patients.findOne({ id: req.query.id }, (err, doc) => {
    if (!doc) {
      res.render('newrecord', {
        id: req.query.id,
        messageType: 'info',
        message: 'newrecord'
      });
      return;
    }
    if (req.query.messagetype) {
      res.locals.messageType = req.query.messagetype;
      res.locals.message = req.query.message;
      res.render('record', doc);
    } else {
      let hasNotes = doc.notas.length ? true : false;
      res.locals.messageType = !hasNotes ? 'info' : '';
      res.locals.message = !hasNotes ? 'emptynotes' : '';
      res.render('record', doc);
    }
  });
});

router.post('/storerecord', (req, res, next) => {
  if (!req.cookies.user) {
    res.render('login')
    return;
  }
  let Datastore = require('nedb');
  let patients = new Datastore({ filename: `${req.cookies.user}.db`, autoload: true });
  let record = {
    id: req.body.id,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    fdn: req.body.fdn,
    tel: req.body.tel,
    email: req.body.email,
    antecedentes: req.body.antecedentes,
    notas: []
  };
  patients.insert(record, (error, newRecord) => {
    if (error) {
      console.log('Error al insertar nuevo paciente');
    } else {
      res.locals.messageType = 'success';
      res.locals.message = 'storedrecord';
      res.render('record', newRecord);
    }
  });
});

router.post('/storenote', (req, res, next) => {
  if (!req.cookies.user) {
    res.render('login')
  }
  let Datastore = require('nedb');
  let pacientes = new Datastore(
    {
      filename: `${req.cookies.user}.db`,
      autoload: true
    }
  );
  let nota =
  {
    stamp: Date.now(),
    enfactual: req.body.enfactual,
    exfisico: req.body.exfisico,
    excomple: req.body.excomple,
    enfactual: req.body.enfactual,
    diagnosticos: req.body.diagnosticos,
    tratamiento: req.body.tratamiento
  };
  pacientes.update({ id: req.body.id }, { $push: { notas: nota } }, {}, (err) => {
    if (err) {
      res.redirect(`/records?id=${req.body.id}&messagetype=warning&message=error`);
    } else {
      res.redirect(`/records?id=${req.body.id}&messagetype=success&message=storednote`);
    }
  });
});


module.exports = router;