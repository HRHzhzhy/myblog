var express = require('express');
//处理路径的 path join resolve
// url querystring JSON.parse
var path = require('path');
//收藏夹图标
var favicon = require('serve-favicon');
//写日志的
var logger = require('morgan');
//cookie和session
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);//注意session和mongoconnect用法
//flash
var flash = require('connect-flash');//依赖session执行
var config = require('./models/config');
var bodyParser = require('body-parser');
//主页路由 index.js
var routes = require('./routes/index');
//用户路由 users.js
var users = require('./routes/users');
//文章路由 articles.js
var articles = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//处理content-type = json {"key":"value"}形式的字符串
app.use(bodyParser.json());
//处理
app.use(bodyParser.urlencoded({ extended: false }));
//读取cookie req.cookies 写入cookie res.cookie(key,value)
app.use(cookieParser());
//session依赖cookie
app.use(session({
    secret:'myblog',
    resave:true,//每次响应结束后保存一次session
    saveUninitialized:true,//保存新创建,但是未初始化的session
    store: new MongoStore({//将session保存到数据库
      url:config.dbUrl
    })
}));
app.use(flash());//依赖session
//将session中的对象赋值给 res.locals.user
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    res.locals.keyword = req.session.keyword;
    res.locals.success = req.flash('sucess');
    res.locals.error = req.flash('error');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
//指定路由中间件:这里的路径不是完整的路径,只是前半段的路径,访问时先在这里匹配前面的路径,根据前面的路径再去找到routers下面的具体的路由
app.use('/', routes);//访问/,跳转到routes,默认使用index
app.use('/users', users);//访问 /users/xxx 使用users路由,users.js中匹配xxx
app.use('/articles',articles);













// catch 404 and forward to error handler
//上面所有的路由和中间件都没有处理请求,所以404了,前面只要能处理就不会404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {//渲染error模板
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
