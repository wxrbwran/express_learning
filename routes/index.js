var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const { a, as1 } = req.query;
  console.log(a, as1);
  res.render('index', { title: 'Express' });
});

module.exports = router;
