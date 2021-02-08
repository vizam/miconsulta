var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
   if (!req.cookies.user) {
      res.render('login');
   } else {
      res.render('ajustes');
   }
});

module.exports = router;