var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {
   res.render('login');
});

router.post('/', function (req, res, next) {
   var Datastore = require('nedb');
   var users = new Datastore({ filename: 'users.db', autoload: true });
   var email = req.body.email;
   var password = req.body.password;
   users.findOne({ email: email }, (err, doc) => {
      if (!doc) {
         res.render('login', {msg: 'No existes becerro....'});
      } else if (password != doc.password) {
         res.render('login', {msg: 'No es tu clave... pilas !...'});
      } else {
         res.cookie('doctor', doc.email);
         res.redirect('/doctor');
      }
   });
});

router.get('/register', function (req, res, next) {
   res.render('register');
});

router.post('/storeuser', function (req, res, next) {
   var Datastore = require('nedb');
   var users = new Datastore({ filename: 'users.db', autoload: true });
   var user = {
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password
   };
   users.findOne({ email: user.email }, (err, doc) => {
      if (doc) {
         res.send('Este usuario ya existe !' + doc);
      } else {
         console.log('introduciendo nuevo usuario');
         users.insert(user, (err, newDoc) => {
            if (err) {
               res.send('Error al insertar nuevo usuario');
            } else {
               res.cookie('doctor', newDoc.email);
               res.redirect('/doctor');
            }
         });
      }
   });
});


module.exports = router;