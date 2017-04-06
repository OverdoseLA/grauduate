/**
 * Created by sunshine on 2017/3/15.
 */
const user = require('../model/user')
const test = require('../model/test')
const sites = require('../model/site')
const teacher = require('../model/teacher')
const classes = require('../model/class')
const build = require('../model/bookbuild')
const summary = require('../model/summary')
const reference = require('../model/reference')
var resdata;
exports.initData = (req,res,next)=>{
    resdata = {
        statusCode:0,
        msg:''
    }
    next()
}
exports.register = (req,res)=>{
    var username = req.body.username,
        password = req.body.password,
        repassword = req.body.repassword;
    if (!username){
        resdata.statusCode = 1;
        resdata.msg = '请输入用户名';
        res.json(resdata)
        return
    }
    if (!password){
        resdata.statusCode = 2;
        resdata.msg = '请输入密码';
        res.json(resdata)
        return
    }
    if (!repassword || repassword!==password){
        resdata.statusCode = 3;
        resdata.msg = '两次密码输入不一致';
        res.json(resdata)
        return
    }
    //验证数据库
    user.findOne({username:username},(err,result)=>{
        if (result){
            resdata.statusCode = 4;
            resdata.msg = '用户名已存在';
            res.json(resdata)
        }else if(username =='admin'){
            user.create({
                username:username,
                password:password,
                isAdmin:'是'
            }).then((result)=>{
                if (!result){
                    resdata.msg = '注册失败';
                    res.json(resdata)
                    return
                }
                resdata.msg = '注册成功';
                res.json(resdata)
            })
            return
        }else{
            user.create({
                username:username,
                password:password
            }).then((result)=>{
                if (!result){
                    resdata.msg = '注册失败';
                    res.json(resdata)
                    return
                }
                resdata.msg = '注册成功';
                res.json(resdata)
            })
        }
    })
}

exports.login = (req,res)=>{
    var username = req.body.username,
        password = req.body.password;
    if (!username || !password){
        resdata.statusCode = 1;
        resdata.msg = '用户名或密码不能为空！';
        res.json(resdata)
        return
    }
    //此处添加正则表达式的验证
    user.findOne({
        username:username,
        password:password
    }).then((result)=>{
        if (!result){
            resdata.statusCode  = 2;
            resdata.msg = '用户不存在';
            res.json(resdata)
            return
        }
        resdata.msg = '登录成功';
        resdata.userInfo = {
            uid:result._id,
            username:result.username
        }

        res.cookie('userInfo',JSON.stringify({
            uid:result._id,
            username:result.username
        }),{maxAge:10000000})
        res.json(resdata)
    })
}

exports.logout = (req,res)=>{
    res.cookie('userInfo',null);
    res.json(resdata)
}
exports.changemsg = (req,res)=>{
    resdata.msg = ''
    var ask = req.body.chaask,
        ans1 = req.body.chaans1,
        ans2 = req.body.chaans2,
        ans3 = req.body.chaans3,
        ans4 = req.body.chaans4,
        rightans = req.body.charigh
    var _id = req.body.middle
    var oldValue = {_id:_id}
    var newValue = {$set:{ask:ask,answers1:ans1,answers2:ans2,answers3:ans3,
        answers4:ans4,rightanswer:rightans}}
    test.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
        }else{
            // resdata.msg = '修改成功！'
        }
        res.end()
    })
}//题库的修改操作
exports.changemsg2 = (req,res)=>{
    var ask = req.body.username,
        ans1 = req.body.password
    var _id = req.body.middle
    var oldValue = {_id:_id}
    var newValue = {$set:{username:ask,password:ans1}}
    user.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
        }else{
            // resdata.msg = '修改成功！'
        }
        res.end()
    })
}//用户的修改操作
exports.deletemsg = (req,res)=>{
    var contion = req.body.middle
    test.remove({_id:contion},(err,question)=>{
        if (err){
            return
        }
    })
}//题库的删除操作
exports.deletemsg2 = (req,res)=>{
    var contion = req.body.middle
    user.remove({_id:contion},(err,question)=>{
        if (err){
            return
        }
    })
}//用户的删除操作
exports.deletesite = (req,res)=>{
    var contion = req.body.middle;
    sites.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changesite = (req,res)=>{
    var site = req.body.site
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{site:site}}
    sites.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
//教师信息的删除
exports.delTeacher = (req,res)=>{
    var contion = req.body.middle;
    teacher.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changeTeach = (req,res)=>{
    var name = req.body.name,
        sexs = req.body.sex,
        births = req.body.birth,
        academics = req.body.academic,
        tel = req.body.tel,
        email = req.body.emails,
        abstract = req.body.abs;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{teachname:name,sex:sexs,birth:births,academic:academics,
    tel:tel,email:email,abstract:abstract}}
    teacher.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}

exports.changeClass = (req,res)=>{
    var classmsg = req.body.classmsg,
        classfea = req.body.feater,
        classteac = req.body.teaching;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{classmsg:classmsg,feater:classfea,teaching:classteac}}
    classes.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
//对教材建设历程进行操作
exports.changebuild = (req,res)=>{
    var classmsg = req.body.auhtname,
        classfea = req.body.bkname_ele_,
        classteac = req.body.pub;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{author:classmsg,bookname:classfea,publisher:classteac}}
    build.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.delbuild = (req,res)=>{
    var contion = req.body.middle;
    build.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
//对教材参考信息进行操作
exports.changerefe = (req,res)=>{
    var classmsg = req.body.auhtname;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{bookmsg:classmsg}}
    reference.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.delrefe = (req,res)=>{
    var contion = req.body.middle;
    reference.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changesum = (req,res)=>{
    var classmsg = req.body.auhtname,
        classfea = req.body.bkname_ele_,
        classteac = req.body.pub,
        item_ele = req.body.item;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{summary:classmsg,pre:classfea,after:classteac,item:item_ele}}
    summary.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}