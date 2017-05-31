var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const { a, as1 } = req.query;
  console.log(a, as1);
  res.render('index', { title: 'Express' });
});
router.get('/about', function(req, res, next) {
  res.type('text/plain');
  res.send('About Web');
});

module.exports = router;
