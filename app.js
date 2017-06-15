const express= require('express');
const path= require('path');
const multer = require('multer');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');

const credentials = require('./config/credentials.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log(file);
    const fileNameArray = file.originalname.split('.');
    const ext = fileNameArray[fileNameArray.length -1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  }
})
const upload = multer({ storage });

const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));
app.use(require('express-session')());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  function (req, res, next){
    // 如果有即显消息，把它传到上下文中，然后清除它
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
  });
app.use('/', index);
app.use('/users', users);
app.use('/api', api);


app.disable('x-powered-by');

app.post('/process', upload.single('photo'), function (req, res){
  const cookie = req.cookies.monster;
  const signedCookie = req.signedCookies.signedMonster;
  res.clearCookie('monster');
  if(req.xhr) {
    console.log(req.file, req.body);
    req.session.userName = req.body.name;
    res.json({success: true})
  } else {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/home');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // const err = new Error('Not Found');
  res.status(404);
  res.render('404');
  // next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
