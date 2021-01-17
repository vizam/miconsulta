var express = require('express');
var router = express.Router();

var Datastore = require('nedb');
var db = new Datastore({ filename: "public/mydb" });

db.loadDatabase((err) => {
  if (err) {
    console.log("error de db");
  } else {
    console.log("db bien");
  }
});


/* GET home page. */
router.get('/', function (req, res, next) {
  /*res.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache',
    'Cache-Control': 'must-revalidate',
   });*/
  //res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});

router.get('/leerDB', function (req, res, next) {
  console.log('query es ' + req.query);
  console.log('params es ' + JSON.stringify(req.params));
  //console.log("Id es: " + req.query.id);
  db.findOne({ id: req.query.id }, (err, doc) => {
    if (err) {
      console.log("error al buscar el id enviado");
    } else {
      console.log('doc es ' + doc);
      console.log('type of es ' + typeof (doc));
      //console.log('el array de docs tiene longitud de ' + doc.length);
      //console.log('este doc tiene id ' + docs[0].id);
      let documento = doc ?? 'null';
      res.send(documento); //this method converts object to JSON
    }
  });
});
/**
 * 
 * 
 * @param {object} req
 * @param {doc} object with the newly inserted document
 * req.body is javascript object
 */
router.post('/grabarPaciente', function (req, res, next) {
  db.insert(req.body, (err, doc) => {
    if (err) {
      console.log('error al meter registro');
    } else {
      res.end();
    }
  });
});

/**
 * 
 * req.query.id is included
 * 
 * req.body is javascript object
 */
router.post('/grabarNota', function (req, res, next) {
  let nuevaNota = req.body;
  console.log('nuevaNota es ' + JSON.stringify(nuevaNota));
  db.update({ id: req.query.id }, {$push: {notas: nuevaNota }}, {}, (err) => {
    if (err) {
      console.log('error al meter registro');
    } else {
      res.end()
    }
  });
});

module.exports = router;
