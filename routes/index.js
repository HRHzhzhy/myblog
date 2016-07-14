var express = require('express');
//调用router方法生成路由实例
var router = express.Router();
var markdown = require('markdown').markdown;
var models = require('../models');
/* GET home page. 
* path 指定路径
* listener 指定回调函数
* */
router.get('/', function(req, res, next) {
  //取得keyword
  /**
   * 查询
   * 1、获取keyword
   * 2、构建查询正则表达式
   * 3、把查询queryObj作为find的参数
   * @type {Document.keyword}
     */
  var keyword = req.query.keyword;
  var queryObj = {};
  if(keyword){
    var reg = new RegExp(keyword);
    queryObj = {$or:[{title:reg},{content:reg}]};
    // console.log(reg,queryObj);
    req.session.keyword = keyword;//保存搜索关键字

  }
  /**
   * 分页
   * pageNum,pageSize,currentPage,
   *
   * .skip((pageNum-1)*pageSize).limit(pageSize)
   */
  var pageNum = parseInt(req.query.pageNum) || 1;
  var pageSize = req.query.pageSize || 5;


  models.Article.find(queryObj).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
    // console.log('文章列表',articles);
    models.Article.count(queryObj,function(err,count){
      // console.log(count,'count');
      res.render(
          'index',
          {
            title: '首页',
            articles:articles,
            pageSize:pageSize,
            pageNum:pageNum,
            keyword:keyword,
            totalPage:Math.ceil(count/pageSize)
          }
      );
    });


  })
  
});
module.exports = router;
