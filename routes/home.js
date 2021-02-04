var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {
   res.render('home', {tema: req.cookies.tema});
});

module.exports = router;