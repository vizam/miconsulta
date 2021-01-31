var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
  res.send('Raiz de /doctors con metodo GET');

});

router.post('/', (req, res, next) => {
  res.send('hola soy 2');
})



module.exports = router;