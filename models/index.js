/**
 * Created by zhenyong on 16/7/10.
 */
var mongoose = require('mongoose');
var config = require('./config');
var ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(config.dbUrl);

exports.User = mongoose.model('user',new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
}));

exports.Article = mongoose.model('article',new mongoose.Schema({
    title:String,
    content:String,
    createAt:{type:Date,default:Date.now()},
    poster:String,
    comments:[{user:{type:ObjectId,ref:'user'},content:String,createAt:{type:Date,default:Date.now()}}],
    user:{type:ObjectId,ref:'user'}//是一个对象id类型,引用上面定义的用户类型
}));
