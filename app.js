const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const responseTime = require('response-time')
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const compression = require('compression');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoSessionStore = require('connect-mongo')(session);

const credentials = require('./config/credentials.js');
const index = require('./routes/index');
const users = require('./routes/users');
const vacation = require('./routes/vacation');
const api = require('./routes/api');
// const rest = require('./routes/restful-api');


const app = express();
app.disable('x-powered-by');

mongoose.connect('mongodb://test:qingfei775@127.0.0.1/test', {
  useMongoClient: true,
});

const con = mongoose.connection;
con.on('error', console.error.bind(console, '连接数据库失败'));
con.once('open',()=>{
  console.log('已成功连接数据库');
  //成功连接
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
/*
* 每个请求都在一个域中处理是一种好的做法，
* 这样你就可以追踪那个请求中所有的未捕获错误并做出相应的响应（正常地关闭服务器）。
* 添加一个中间件就可以非常轻松地满足这 个要求。
* 这个中间件应该在所有其他路由或中间件前面：
* */
app.use( function (req, res, next){
  // 为这个请求创建一个域
  var domain = require('domain').create();
  // 处理这个域中的错误
  domain.on('error', function (err) {
    console.error('DOMAIN ERROR CAUGHT\n', err.stack);
    try { // 在 5 秒内进行故障保护关机
      setTimeout(function (){ console.error('Failsafe shutdown.');
        process.exit(1); }, 5000);
      // 从集群中断开
      var worker = require('cluster').worker;
      if (worker) worker.disconnect();
      // 停止接收新请求
      server.close();
      try {
        // 尝试使用 Express 错误路由
        next(err);
      } catch (err) {
        // 如果 Express 错误路由失效，尝试返回普通文本响应
        console.error('Express error mechanism failed.\n', err.stack);
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Server error.');
      }
    } catch (err){
      console.error('Unable to send 500 response.\n', err.stack);
    }
  });
  // 向域中添加请求和响应对象
  domain.add(req);
  domain.add(res);
  // 执行该域中剩余的请求链
  domain.run(next);
});

switch (app.get('env')) {
  case 'production':
    app.use(require('express-logger')({
      path: __dirname+'/log/request.log',
    }));
    break;
  case 'development':
  default:
    app.use(logger('dev'));
    break;
}
app.use(responseTime());
app.use(express.static(path.join(__dirname, 'public'), {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1h',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}));
app.use(compression({filter: shouldCompress}));

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));
app.use(session({
  secret: 'RE7ty87gyF^%RT&^UYgvc6Ut*gyV5&YUTR#%$%&^*IGFRDFCNH',
  key: 'test', //db_config.module.database,//cookie name
  cookie: {maxAge: 1000*60*60*24*7},//7 days
  resave: false,
  saveUninitialized: true,
  store: new MongoSessionStore({
    db: 'sessions',
    url: 'mongodb://test:qingfei775@127.0.0.1/test',
  })
}));

app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
);

app.use(function(req, res, next) {
  // 如果有即显消息，把它传到上下文中，然后清除它
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// app.use( function (req,res,next){
//   var cluster = require('cluster');
//   if (cluster.isWorker)
//     console.log('Worker %d received request', cluster.worker.id);
// });

app.use('/', index);
app.use('/users', users);
app.use('/vacation', vacation);
app.use('/api', require('cors')(), api);
// app.use(rest);

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
  console.error(err.stack);
  if (req.xhr) {
    res.status(500).send({ error: err.stack });
  } else {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
