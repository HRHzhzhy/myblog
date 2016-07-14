/**
 * Created by zhenyong on 16/7/11.
 */
exports.checkLogin = function(req,res,next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/users/login');
    }
};
//登录之前访问的内容
exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
        res.redirect('/users/login');
        
    }else{
        next();
    }
};