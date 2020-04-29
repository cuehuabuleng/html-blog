const router = require('koa-router')()
const { login, register, getImgurl } = require('../controller/user');
const { newauthorlist } = require('../controller/admin')
const { SuccessModal, ErroModal } = require('../model/resModel');

router.prefix('/api/user')

//登录接口
router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body;
    const data = await login(username, password)
    if (data.username) {
        //设置session 
        if (data.username === 'admin') {
            ctx.session.username = data.username;
            ctx.session.realname = data.adminname;
            console.log('超级管理员登录成功')
            ctx.body = new SuccessModal({
                superadmin: true,
                msg: '登录成功'
            })
            return;
        }
        console.log('session is', ctx.session.realname)
        ctx.session.username = data.username;
        ctx.session.realname = data.realname;
        ctx.body = new SuccessModal({
            superadmin: false,
            msg: '登陆成功'
        })
        return
    }
    ctx.body = new ErroModal('登录失败')
})

//注册接口
router.post('/register', async function (ctx, next) {
    console.log('注册', ctx.request.body)
    const { username, password, realname, user_img } = ctx.request.body;
    const author = realname;
    const article_num = 0;
    const data = await register(username, password, realname, user_img);

    if (data.isRegister === true) {
        //注册成功后把捉着信息加入作者列表数据库
        const authordata = await newauthorlist(username, author, article_num);
        if (authordata.isAdd === true) {
            ctx.body = new SuccessModal('作者入库成功')
        }else{
            ctx.body = new ErroModal('作者入库失败')
        }
        ctx.body = new SuccessModal('注册成功')
    } else {
        ctx.body = new ErroModal(data.msg)
    }
    console.log('注册接口', data)
})

// router.get('/session-test', async function (ctx, next){
//     if(ctx.session.viewCount === null){
//         ctx.session.viewCount = 0;
//     }
//     ctx.session.viewCount ++;
//     ctx.body = {
//         errno:0,
//         viewCount:ctx.session.viewCount
//     }
// })

// 验证是否登录
router.get('/checkLogin', async function (ctx, next) {
    try {
        if (ctx.session.username) {
            const userImg = await getImgurl(ctx.session.username);
            let returnData;
            if (ctx.session.username === 'admin') {
                returnData = {
                    superadmin: true,
                    realname: ctx.session.realname,
                    username: ctx.session.username,
                    user_img: userImg.user_img,
                    msg: '已经登录'
                }
            } else {
                returnData = {
                    superadmin: false,
                    realname: ctx.session.realname,
                    user_img: userImg.user_img,
                    username: ctx.session.username,
                    msg: '已经登录'
                }
            }
            ctx.body = new SuccessModal(returnData)
        } else {
            console.log('未登录')
            ctx.body = new ErroModal('未登录')
        }
    } catch (error) {
        throw new Error(error)
    }

})

//退出登录
router.get('/logOut', async function (ctx, next) {
    try {
        ctx.session = null;
        ctx.body = new SuccessModal('退出成功')
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = router
