var express = require('express');
var router = express.Router();



router.get('/', (req, res, next) => {
  if (!req.cookies.doctor) {
    res.redirect('/users')
  }
  if (!req.query.id) {
    res.render('queryrecord');
  } else {
    next();
  }

});

router.get('/', (req, res, next) => {
  if (!req.cookies.doctor) {
    res.redirect('/users')
  }
  let Datastore = require('nedb');
  let patients = new Datastore({ filename: `${req.cookies.doctor}.db`, autoload: true });
  patients.findOne({ id: req.query.id }, (err, doc) => {
    if (!doc) {
      res.render('newrecord', { id: req.query.id });
    } else {
      res.render('showrecord', doc);
    }
  });
});

router.post('/storerecord', (req, res, next) => {
  if (!req.cookies.doctor) {
    res.redirect('/users')
  }
  let Datastore = require('nedb');
  let patients = new Datastore({ filename: `${req.cookies.doctor}.db`, autoload: true });
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
      res.render('showrecord', newRecord);
    }
  });
});

router.post('/storenote', (req, res, next) => {
  if (!req.cookies.doctor) {
    res.redirect('/users')
  }
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
  let Datastore = require('nedb');
  let pacientes = new Datastore(
    {
      filename: `${req.cookies.doctor}.db`,
      autoload: true
    }
  );
  pacientes.update({ id: req.body.id }, {$push: {notas: nota }}, {}, (err) => {
    if (err) {
      console.log('error al meter registro');
    } else {
      res.redirect(`/records?id=${req.body.id}`);
    }
  })


  
});



module.exports = router;