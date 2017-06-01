var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/tours', function(req, res, next) {
  const tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
  ];
  res.json(tours);
});

module.exports = router;
