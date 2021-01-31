var express = require('express');
var router = express.Router();

var Datastore = require('nedb');
var users = new Datastore({ filename: 'users.db', autoload: true });

router.get('/', function (req, res, next) {
   res.render('login');
});

router.post('/', function (req, res, next) {
   var email = req.body.email;
   var password = req.body.password;
   users.findOne({ email: email }, (err, doc) => {
      if (!doc) {
         res.render('login', {msg: 'No existes becerro....'});
      } else if (password != doc.password) {
         res.render('login', {msg: 'No es tu clave... pilas !...'});
      } else {
         res.send('vamos bien, ahora hagamos la app');
      }
   });
});

router.get('/register', function (req, res, next) {
   res.render('register');
});

router.post('/storeuser', function (req, res, next) {

   var user = {
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
   };
   users.findOne({ email: user.email }, (err, doc) => {
      if (doc) {
         res.send('aqui hay uno...' + doc);
      } else {
         console.log('introduciendo nuevo usuario');
         users.insert(user, (err, newDoc) => {
            if (err) {
               res.send('Error al insertar nuevo usuario');
            } else {
               res.redirect('/doctors', { id: newDoc._id });
            }
         });
      }
   });
});


module.exports = router;