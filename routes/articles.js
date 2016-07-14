/**
 * Created by zhenyong on 16/7/10.
 */
var express = require('express');
var models = require('../models/index');

/**
 * 文件处理
 */
var multer = require('multer');
//指定存储目录和文件名
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, '../public/uploads')
   },
   filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname)
   }
});
//upload中间件
var upload = multer({ storage: storage });


//路由实例
var router = express.Router();
router.get('/add',function(req,res){
   res.render('article/add',{title:'发布文章',article:{}}) ;
});
//添加upload,处理上传的文件,解析body
router.post('/post',upload.single('poster'),function(req,res){
   var article = req.body;
   console.log(article._id);
   article.user = req.session.user._id;//获取当前登录用户的id
   var poster = req.filename ? '/uploads/default.jpg':'/uploads/'+req.file.filename;
   console.log(poster);

   //如果是更新内容,隐藏域_id会有值
   var _id = article._id;
   if(_id){//更新文章
      var updateObj = {title:article.title,content:article.content};
      models.Article.update({_id:_id},{$set:updateObj},function(err,result){
         if(err){
            console.log('更新失败');
            res.redirect('/');
         }else{
            console.log('更新成功');
            res.redirect('/');
         }
      })
   }else{//添加文章
      models.Article.create({
         title:article.title,
         poster:poster,
         user:article.user,
         content:article.content
      },function(err,doc){
         if(err){
            console.log('创建文章err',err);
            req.flash('error','文章发表失败');
         }else{
            // console.log('创建文章',doc);
            req.flash('success','文章发表成功');
            res.redirect('/')
         }
      })
   }
});
//模板传递过来的参数,使用:id
router.get('/detail',function(req,res){
      // var _id = req.param._id
      var _id = req.query.id;
      //comments.user 需要转换成对象,才能访问user的属性
      models.Article.findById(_id).populate('comments.user').exec(function(err,doc){
         // console.log(doc);
         res.render('article/detail',{title:'文章详情',article:doc})
      })
});
//模板传递过来的参数,使用:id
router.get('/delete/:_id',function(req,res){
   var _id = req.params._id;
   models.Article.remove({_id:_id},function(err,result){
      res.redirect('/');
   })
});
router.get('/edit/:_id',function(req,res){
   var _id = req.params._id;
   models.Article.findById(_id,function(err,doc){
      res.render('article/add',{title:'编辑文章',article:doc});
   })
});
router.post('/comment',function(req,res){
   var user = req.session.user;
   console.log(req.body._id);
   models.Article.update({_id:req.body._id},{$push: {comments:{user:user._id,content:req.body.content}}},function(err,result){
      if(err){
         console.log(err);
         res.redirect('back');
      }else{
         res.redirect('back');
      }
   })
});
module.exports = router;