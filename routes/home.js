var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {
   console.log(req.params.nombre);
   res.render('home');
});

module.exports = router;