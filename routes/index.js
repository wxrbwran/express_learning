var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const { a, as1 } = req.query;
  console.log(a, as1);
  res.render('index', {
    title: 'Express',
    userName: !!req.session ? req.session.userName : null,
  });
});
router.get('/about', function(req, res, next) {
  res.render('about', {
    title: 'about',
    text: 'about me',
  });
});

router.get('/about/:userId', function(req, res, next) {
  res.type('text/plain');
  console.log(req.params, req.query, req.body,
    req.xhr, req.url);
  res.send('about');
});

router.get('/headers', function(req, res, next) {
  res.type('text/plain');
  let s = '';
  for (let k in req.headers) {
    s += `${k}:${req.headers[k]}\n`;
  }
  res.send(s);
});

router.get('/test', function(req, res, next) {
  const data = {
    currency: { name: 'United States dollars', abbrev: 'USD'},
    tours: [
      { name: 'Hood River', price: '$99.95' },
      { name: 'Oregon Coast', price: '$159.95'}
    ],
    specialsUrl: '/january-specials',
    currencies: [ 'USD', 'GBP', 'BTC' ],
  }
  res.render('test', {
    currency: data.currency,
    tours: data.tours,
    specialsUrl: data.specialsUrl,
    currencies: data.currencies,
  });
});

router.get('/home', function(req, res, next) {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }
  res.locals.partials.weather = getWeatherData();
  res.render('home');
});
router.get('/newsletter', function (req, res){
  res.cookie('monster', 'mom mon');
  res.cookie('signedMonster', 'mom mon11', {signed: true});
  // 我们会在后面学到 CSRF……目前，只提供一个虚拟值
  res.render('news_letter', { csrf: 'CSRF token goes here' });
});


function getWeatherData(){
  return {
    locations:
      [ { name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',
        },
        { name: 'Bend',
          forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
          iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
          weather: 'Partly Cloudy',
          temp: '55.0 F (12.8 C)'
        },
        { name: 'Manzanita',
          forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
          iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
          weather: 'Light Rain',
          temp: '55.0 F (12.8 C)'
        }
    ]
  };
}

module.exports = router;
