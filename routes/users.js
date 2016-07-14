var express = require('express');
var router = express.Router();
//auto验证
var auth = require('../middleware/auth');
//引入user 数据模型
var models = require('../models');
/* GET users listing.
*
* */
//这里的路径是 urers/xxx 是从app中过来的
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg', auth.checkNotLogin,function(req, res, next) {
  res.render('user/reg',{title:'注册'});
});
router.get('/login',auth.checkNotLogin, function(req, res, next) {
  res.render('user/login',{title:'登录'});
});

function md5(str){
  return require('crypto')
      .createHash('md5')
      .update(str)
      .digest('hex');
}
router.post('/reg', function(req, res, next) {
  var user = req.body;
  if(user.password != user.repassword){
    return res.redirect('back');
  }
  user.password = md5(user.password);
  user.avatar = 'https://secure.gravatar.com/avatar/'+md5(user.email)+'?s=48';
  models.User.create(user,function(err,doc){
    if(err){
      // console.log('error',err)
      req.flash('error','登录成功');
      // res.redirect('/u')
    }else{
      req.flash('success','注册成功');
      // console.log('success',doc)
      res.redirect('/users/login')
    }
  })
});


router.post('/login', function(req, res, next) {
  var user = req.body;
  models.User.findOne({username:user.username,password:md5(user.password.toString())},function(err,doc){
    if(doc){//登录成功,跳转到首页
      //设置session,登录成功,将查询到的user用户赋值给session的user属性
      req.session.user = doc;
      console.log('whoLogin',req.session.user);
      req.flash('success','登录成功');
      res.redirect('/')
    }else{
      req.flash('error','登录成功');
      res.redirect('back')
    }
  })
});
router.get('/logout', function(req, res, next) {
  console.log('logoutle ');
  req.session.user = null;
  console.log('logout',req.session.user);
  req.flash('success','退出成功');
  res.redirect('/');
});
module.exports = router;
