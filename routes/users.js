var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {
   if (!req.cookies.user) {
      res.render('login');
   } else {
      res.redirect('/records');
   }
});

router.post('/', function (req, res, next) {
   var Datastore = require('nedb');
   var users = new Datastore({ filename: 'users.db', autoload: true });
   var email = req.body.email;
   var password = req.body.password;
   users.findOne({ email: email }, (err, doc) => {
      if (!doc) {
         res.render('login', {messageType: 'warning', message: 'nouser'});
      } else if (password != doc.password) {
         res.render('login', {messageType: 'warning', message: 'wrongpass'});
      } else {
         res.cookie('user', doc.email);
         res.redirect('/records');
      }
   });
});

router.get('/register', function (req, res, next) {
   res.render('register');
});

router.post('/storeuser', function (req, res, next) {
   console.log(req.body.email);
   console.log(req.body.code);
   if (req.body.code != 'zv4p') {
      res.render('register', {messageType: 'warning', message: 'badcode'});
      return;
   }  
   var Datastore = require('nedb');
   var users = new Datastore({ filename: 'users.db', autoload: true });
   var user = {
      email: req.body.email,
      password: req.body.password
   };
   users.findOne({ email: user.email }, (err, doc) => {
      if (doc) {
         res.render('register', {messageType: 'warning', message: 'registeredmail'});
      } else {
         users.insert(user, (err, newDoc) => {
            if (err) {
               res.render('register', {messageType: 'warning', message: 'error'});
            } else {
               res.cookie('user', newDoc.email);
               res.render('login', { messageType: 'success', message: 'success'});
            }
         });
      }
   });
});

router.get('/logout', (req, res, next) => {
   res.clearCookie('user');
   res.render('login');
})

module.exports = router;