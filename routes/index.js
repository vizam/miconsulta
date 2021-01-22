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
  db.findOne({ id: req.query.id }, (err, doc) => {
    if (err) {
      console.log("error al buscar el id enviado");
    } else {
      console.log('doc es ' + doc);
      let documento = doc ?? 'null';
      res.send(documento); //this method converts object to JSON
    }
  })
});
/**
 * 
 * 
 * @param {object} req
 * @param {doc} object with the newly inserted document
 * req.body is javascript object
 */
router.post('/grabarPaciente', function (req, res, next)
{
  db.findOne({id: req.body.id}, (err, doc) =>
  {
    if (err)
    {
      console.log('Se produjo un error !');
      res.send('error');
      res.end();
    }
    if (doc != null)
    {
      console.log('Ese archivo ya existe !');
      res.send('repetido');
    } else {
      db.insert(req.body, (err, doc) => 
      {
        if (err)
        {
          console.log('error al meter registro');
          res.send('error');
        } else
        {
          res.send(doc);
        }
      });
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
  db.update({ id: req.query.id }, {$push: {notas: nuevaNota }}, {}, (err) => {
    if (err) {
      console.log('error al meter registro');
    } else {
      res.end()
    }
  })
});

module.exports = router;
