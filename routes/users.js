var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {
   if (!req.cookies.doctor) {
      res.render('login');
   } else {
      res.redirect('records');
   }
});

router.post('/', function (req, res, next) {
   var Datastore = require('nedb');
   var users = new Datastore({ filename: 'users.db', autoload: true });
   var email = req.body.email;
   var password = req.body.password;
   users.findOne({ email: email }, (err, doc) => {
      if (!doc) {
         res.render('login', {type: 'Warning', msg: 'No user associated to that email'});
      } else if (password != doc.password) {
         res.render('login', {type: 'Warning', msg: 'Password provided is wrong'});
      } else {
         res.cookie('doctor', doc.email);
         res.redirect('/records');
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
         res.render('register', {type: 'Warning', msg: 'Email already registered'});
      } else {
         users.insert(user, (err, newDoc) => {
            if (err) {
               res.render('register', {type: 'Warning', msg: 'Error inserting new user'});
            } else {
               res.cookie('doctor', newDoc.email);
               res.redirect('/records');
            }
         });
      }
   });
});


module.exports = router;