var express = require('express');
var router = express.Router();
const multer = require('multer');
const csurf = require('csurf');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    console.log(file);
    const fileNameArray = file.originalname.split('.');
    const ext = fileNameArray[fileNameArray.length - 1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

const Customer = require('../models/customer');

/* GET home page. */
router.get('/', function(req, res, next) {
  const { a, as1 } = req.query;
  console.log(a, as1);
  res.render('index', {
    title: 'Express',
    userName: !!req.session ? req.session.userName : null
  });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  console.log(email, password, password2);
  if (password === password2) {
    const customer = new Customer({
      email: email,
      password: password
    });
    Customer.findOne({ email: email }, function(err, user) {
      if (!!user && user.email === email) {
        req.session.flash = {
          type: 'fail',
          intro: '错误!',
          message: '该邮箱已存在！'
        };
        return res.redirect(303, '/register');
      } else {
        customer.save(function(err, customer) {
          if (err) {
            return res.redirect(303, '/register', {
              message: '注册失败！',
              error: error
            });
          } else {
            req.session.flash = {
              type: 'success',
              intro: '恭喜!',
              message: '注册成功！'
            };
            return res.redirect(303, '/login');
          }
        });
      }
    });
  } else {
    next();
  }
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/home', function(req, res, next) {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }
  res.locals.partials.weather = getWeatherData();
  res.render('home');
});
router.get('/newsletter', function(req, res) {
  res.cookie('monster', 'mom mon');
  res.cookie('signedMonster', 'mom mon11', { signed: true });
  // 我们会在后面学到 CSRF……目前，只提供一个虚拟值
  res.render('news_letter', { csrf: 'CSRF token goes here' });
});

router.post('/process', upload.single('photo'), function(req, res) {
  const cookie = req.cookies.monster;
  const signedCookie = req.signedCookies.signedMonster;
  res.clearCookie('monster');
  if (req.xhr) {
    console.log(req.file, req.body);
    req.session.userName = req.body.name;
    // res.json({ success: true });
  } else {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    req.session.flash = {
      type: 'danger',
      intro: 'Validation!',
      message: 'The email address'
    };
    req.session.userName = req.body.name;
    res.redirect(303, '/home');
  }
});

function getWeatherData() {
  return {
    locations: [
      {
        name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)'
      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)'
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)'
      }
    ]
  };
}

module.exports = router;
