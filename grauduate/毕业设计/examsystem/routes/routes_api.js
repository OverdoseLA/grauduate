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
const teaching = require('../model/teaching')//教学理念和注意点
const teacinghome = require('../model/teachinghomework')//作业习题
const cal = require('../model/teacingcal')//教学日历
const teachingcourse = require('../model/teacingcourseware')//教学课件
const important = require('../model/importsthings')//重点和难点
const teachref = require('../model/teachreform')
const testref = require('../model/testref')
const interteach = require('../model/interteach')
const bookachieve = require('../model/booksachieve')
const thesis = require('../model/thesis')
const master = require('../model/master')
const teachieve = require('../model/teachachieve')
const doubleteacher = require('../model/doublelanteacher')//教师队伍
const doublebook = require('../model/doublebooks')//教材
const doublecourse = require('../model/doublecourse')//习题
const doubleware = require('../model/doubleteachware')//课件
const doubletests = require('../model/doubletests')//试卷
const doublerefe = require('../model/doublereference')//参考书
const testteach = require('../model/testteach')//实验教学指导思想和课程设计
const testtitle = require('../model/testtile')//实验教学题目及参考答案
const testcourse = require('../model/testcourse')//实验教学创新实践作业
const testexample = require('../model/testexample')//综合实例
const testware = require('../model/testteachware')//实验教学课件
const teachievemsg  = require('../model/teachievemsg')
const teachconmsg = require('../model/teachconmsg')
const fs = require('fs')

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
exports.changeteachmsg = (req,res)=>{
    var classmsg = req.body.$_1,
        classfea = req.body.$_2;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{idea:classmsg,points:classfea}}
    teaching.update(oldValue,newValue,function(err,result){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.delcal = (req,res)=>{
    var contion = req.body.middle;
    cal.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changecal = (req,res)=>{
    var can1 = req.body.weeks,
        can2 = req.body.teacing,
        can3 = req.body.article,
        can4 = req.body.method,
        can5 = req.body.example,
        can6 = req.body.exercise;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{ weeks:can1,
        teacing:can2,
        article:can3,
        methods:can4,
        example:can5,
        exercise:can6}};
    cal.update(oldValue,newValue,function(err){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
//删除一个文件
function  delonefile(req,res,database) {
    var contion = req.body.middle;
    fs.unlink('./public/teachcourse/'+req.body.file,(err)=>{
        if (err){
            console.log(err)
            return
        }
        console.log('success')
        database.remove({_id:contion},(err,req)=>{
            if (err){
                return
            }
        })
    })
}
function  deltwofile(req,res,database) {
    var contion = req.body.middle;
    fs.unlink('./public/teachcourse/'+req.body.file1,(err)=>{
        if (err){
            console.log(err)
            return
        }
        fs.unlink('./public/teachcourse/'+req.body.file2,(err)=>{
            if (err){
                console.log(err)
                return
            }
            database.remove({_id:contion},(err,req)=>{
                if (err){
                    return
                }
            })
        })
    })
}
exports.delcourse = (req,res)=>{
    delonefile(req,res,teachingcourse)
}
exports.delexercise = (req,res)=>{
    deltwofile(req,res,teacinghome)
}
exports.delimportants = (req,res)=>{
    var contion = req.body.middle;
    teacinghome.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changeimportants = (req,res)=>{
    var can1 = req.body.auhtname,
        can2 = req.body.clfea,
        can3 = req.body.clf;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{chater:can1,
        imports:can2,
        difficulty:can3}};
    important.update(oldValue,newValue,function(err){
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.changeteachres = (req,res)=>{
    var can1 = req.body.classmsg,
        can2 = req.body.feater,
        can3 = req.body.teaching;
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{teachmethodmsg:can1,
        testmethod:can2,
        conmethod:can3}};
    teachref.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.changetestref = (req,res)=>{
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{testarticle:req.body.testarticle_$,
        testmethod:req.body.testmethod_$,
        gradesave:req.body.gradesave_$,
        testingmethod:req.body.testingmethod_$,
        testcharac:req.body.testcharac_$,
        refplan:req.body.refplan_$,
        testingadvantage:req.body.testingadvantage_$}};
    testref.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.changeinterteach = (req,res)=>{
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{ingcharac:req.body.classmsg,
        inglink:req.body.feater}};
    interteach.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.delbookachieve = (req,res)=>{
    var contion = req.body.middle;
    bookachieve.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.delthesis = (req,res)=>{
    thesis.remove({_id:req.body.middle},(err,rq)=>{

    })
}
exports.changethesis = (req,res)=>{
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{ author:req.body.week,
        title:req.body.teacing,
        magazine:req.body.article,
        date:req.body.method}};
    thesis.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.delteachieve = (req,res)=>{
    var contion = req.body.middle;
    teachieve.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changeteachieve = (req,res)=>{
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{ article:req.body.week,
        award:req.body.teacing,
        date:req.body.article,}};
    teachieve.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.delmaster = (req,res)=>{
    var contion = req.body.middle;
    master.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
exports.changemaster = (req,res)=>{
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:{ author:req.body.weeks,
        title:req.body.teacing,}};
    master.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
function  delmseeage(req,database) {
    var contion = req.body.middle;
    database.remove({_id:contion},(err,req)=>{
        if (err){
            return
        }
    })
}
function  changemessage(req,database,contion,res) {
    var oldValue = {_id:req.body.middle}
    var newValue = {$set:contion};
    database.update(oldValue,newValue,function (err) {
        if (err){
            console.log(err)
            return
        }
        res.end()
    })
}
exports.deldoubleteacher = (req,res)=>{
    delmseeage(req,doubleteacher)
}
exports.changedoubleteacher = (req,res)=>{
    changemessage(req,doubleteacher,{
        name:req.body.weeks,
        sex:req.body.teacing,
        birth:req.body.article,
        posts:req.body.method,
        profession:req.body.example,
        works:req.body.exercise
    },res)
}
exports.deldoublebook = (req,res)=>{
    delmseeage(req,doublebook)
}
exports.changedoublebook = (req,res)=>{
    changemessage(req,doublebook,{
        booksname:req.body.weeks,
        bookpublisher:req.body.teacing
    },res)
}
exports.deldoublewares = (req,res)=>{
delonefile(req,res,doubleware)
}
exports.deldoubleref = (req,res)=>{
    delmseeage(req,doublerefe)
}
exports.changedoubleref = (req,res)=>{
    changemessage(req,doublerefe,{
        referencename:req.body.weeks
    },res)
}
exports.deldoublecourse = (req,res)=>{
    delonefile(req,res,doublecourse)
}
exports.deldoubletest = (req,res)=>{
    delonefile(req,res,doubletests)
}
exports.changetestteach = (req,res)=>{
    changemessage(req,testteach,{
        guiding:req.body.classmsg,
        design:req.body.feater,
    },res)
}
exports.deltestware = (req,res)=>{
    delonefile(req,res,testware)
}
exports.deltestcourse = (req,res)=>{
    delonefile(req,res,testcourse)
}
exports.deltesttitle = (req,res)=>{
    deltwofile(req,res,testtitle)
}
exports.deltestexample = (req,res)=>{
    deltwofile(req,res,testexample)
}
exports.delteachievemsg = (req,res)=>{
    delmseeage(req,teachievemsg)
}
exports.delteachconmsg = (req,res)=>{
    delmseeage(req,teachconmsg)
}
exports.changeteachievemsg = (req,res)=>{
    changemessage(req,teachievemsg,{
        msglead:req.body.example,
        msg:req.body.exercise
    },res)
}
exports.changeteachconmsg = (req,res)=>{
    changemessage(req,teachconmsg,{
        msglead:req.body.example,
        msg:req.body.exercise
    },res)
}
