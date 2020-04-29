const router = require('koa-router')()
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
  likeBlog,
  queryLike
} = require('../controller/blog');
const { SuccessModal, ErroModal } = require('../model/resModel');
const loginCheck = require('../middleeware/loginCheck')

router.prefix('/api/blog')

//获取博客列表函数
router.get('/list', async function (ctx, next) {
  let username;
  let keyword;
  if (ctx.session.username === 'admin') {
    username = ctx.query.username || '';
     keyword = ctx.query.keyword || '';
    if (ctx.query.isadmin) {
      //管理员界面
      // console.log('is admin')
      if (ctx.session.username === null || ctx.session.username == undefined) {
        // console.error('is admin , but no login')
        // 未登录
        ctx.body = new ErroModal('未登录')
        return;
      }
      //强制查询自己的博客
      // username = ctx.session.username;

    }
  } else {
    username = ctx.query.author || '';
    keyword = ctx.query.keyword || '';
    console.log('author is ', username, keyword)
    if (ctx.query.isadmin) {
      //管理员界面
      // console.log('is admin')
      if (ctx.session.username === null || ctx.session.username == undefined) {
        // console.error('is admin , but no login')
        // 未登录
        ctx.body = new ErroModal('未登录')
        return;
      }
      //强制查询自己的博客
      username = ctx.session.username;
    }
  }
  const listData = await getList(username, keyword)
  ctx.body = new SuccessModal(listData)

})

//获取列表详情函数
router.get('/detail', async function (ctx, next) {
  const data = await getDetail(ctx.query.id);
  // console.log('router detail return data is', data)
  ctx.body = new SuccessModal(data)
})


//新建博客
router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body;
  body.author = ctx.session.username;
  const data = await newBlog(body)
  ctx.body = new SuccessModal(data)
})

//更新博客
router.post('/update', loginCheck, async function (ctx, next) {
  console.log('更新博客', ctx.request.body)
  const val = await updateBlog(ctx.query.id, ctx.request.body)
  if (val) {
    ctx.body = new SuccessModal()
  } else {
    ctx.body = new ErroModal('更新博客失败')
  }
})
//博客点赞接口
router.post('/addlike', loginCheck, async function (ctx, next) {
  const body = ctx.request.body;
  body.username = ctx.session.username;
  const data = await likeBlog(body)
  ctx.body = new SuccessModal(data);
})
//查询是否点赞接口
router.post('/querylike', loginCheck, async function (ctx, next){
  const body = ctx.request.body;
  body.username = ctx.session.username;
  const data = await queryLike(body);
  console.log('是否点赞数据', data)
  ctx.body = new SuccessModal(data);
})
// 删除博客
router.post('/del', loginCheck, async function (ctx, next) {
  let author;
  if (ctx.session.username === 'admin') {
    author = ctx.query.username
  }else{
    author = ctx.session.username
  }
  console.log('删除', author)
  const val = await delBlog(ctx.query.id, author)
  console.log('删除博客是否成功', val)
  if (val) {
    ctx.body = new SuccessModal()
  } else {
    ctx.body = new ErroModal('删除博客失败')
  }
})



module.exports = router
