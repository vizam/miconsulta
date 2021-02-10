var express = require('express');
var router = express.Router();
var Datastore = require('nedb');

router.all('*', (req, res, next) => {
  if (!req.cookies.user) {
    res.redirect('/users/login');
  } else {
    next();
  }
});

router.get('/', (req, res, next) => {
  if (!req.query.id) {
    res.render('queryrecord');
  } else {
    next();
  }
});

router.get('/', (req, res, next) => {
  let patients = new Datastore({ filename: `${req.cookies.user}.db`, autoload: true });
  patients.findOne({ id: req.query.id }, (err, doc) => {
    if (!doc) {
      res.render('newrecord', {
        id: req.query.id,
        messageType: 'info',
        message: 'newrecord'
      });
    } else {
      res.render('record', doc);
    }
  });
});

router.get('/:msgtype/:msgdetails', (req, res, next) => {
  res.render('queryrecord', {
    messageType: req.params.msgtype,
    message: req.params.msgdetails
  });
});

router.get('/:id/:msgtype/:msgdetails', (req, res, next) => {
  let patients = new Datastore({ filename: `${req.cookies.user}.db`, autoload: true });
  patients.findOne({ id: req.params.id }, (err, doc) => {
    res.locals.messageType = req.params.msgtype;
    res.locals.message = req.params.msgdetails;
    res.render('record', doc);
  });
});

router.post('/storerecord', (req, res, next) => {
  let patients = new Datastore({ filename: `${req.cookies.user}.db`, autoload: true });
  patients.findOne({ id: req.body.id }, (err, doc) => {
    if (doc) {
      res.redirect('/records/warning/error');
    } else {
      next();
    }
  });
});

router.post('/storerecord', (req, res, next) => {
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
      res.redirect('/records/warning/error');
    } else {
      res.redirect(`/records/${newRecord.id}/success/success`);
    }
  });
});

router.post('/storenote', (req, res, next) => {
  let patients = new Datastore(
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
  patients.update({ id: req.body.id }, { $push: { notas: nota } }, {}, (err) => {
    if (err) {
      res.redirect(`/records/${req.body.id}/warning/error`);
    } else {
      res.redirect(`/records/${req.body.id}/success/storednote`);
    }
  });
});



module.exports = router;