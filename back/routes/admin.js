const router = require('koa-router')()
const { getauthorlist, updateauthorlist, newauthorlist } = require('../controller/admin');
const { SuccessModal, ErroModal } = require('../model/resModel');

router.prefix('/api/admin')
//获取作者列表相关信息
router.get('/authorlist', async function (ctx, next) {
    let username = ctx.query.username
    const listData = await getauthorlist(username)
    ctx.body = new SuccessModal(listData)
})
// 更新作者列表相关信息
router.get('/updateauthorlist', async function (ctx, next) {
    let username = ctx.query.username
    let num = ctx.query.article_num
    console.log('更新作者列表进入_1',username, num)
    const val = await updateauthorlist(username, num)
    if (val) {
        ctx.body = new SuccessModal()
    } else {
        ctx.body = new ErroModal('更新文章数量失败')
    }
})


module.exports = router