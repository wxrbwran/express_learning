var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const { a, as1 } = req.query;
  console.log(a, as1);
  res.render('index', { title: 'Express' });
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

router.get('/test_Pug', function(req, res, next) {
  const data = {
    currency: { name: 'United States dollars', abbrev: 'USD'},
    tours: [
      { name: 'Hood River', price: '$99.95' },
      { name: 'Oregon Coast', price: '$159.95'}
    ],
    specialsUrl: '/january-specials',
    currencies: [ 'USD', 'GBP', 'BTC' ],
  }
  res.render('test', {...data});
});

router.get('/weather', function(req, res, next) {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }
  res.locals.partials.weather = getWeatherData();
  res.render('weather');
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
