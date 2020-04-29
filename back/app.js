const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body');
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const serve = require("koa-static");
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog');
const user = require('./routes/user');
const uploadimg = require('./routes/uploadimg')
const admin = require('./routes/admin')
const { REDIS_CONF } =require('./conf/db')

app.use(async (ctx, next) => {
  // 允许来自所有域名请求
  ctx.set("Access-Control-Allow-Origin", "*");
      // 设置所允许的HTTP请求方法
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  await next();
})


// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    maxFieldsSize: 4 * 1024 * 1024, // 最大文件为2兆
    multipart: true // 是否支持 multipart-formdate 的表单
  }
}));


app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname , '/routes/static/img/blog'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
app.use(require('koa-static')(__dirname))
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志写入功能
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  //开发环境/测试环境
  app.use(morgan('dev'))
}else{
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags:'a'
  })
  app.use(morgan('combined',{
    stream:writeStream
  }))
}


// session配置
app.keys= ['wjio!23123_']
app.use(session({
  //配置cookie
  cookie:{
    path:'/',
    httpOnly:true,
    maxAge:2 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}` //写死本地的redis
  })
}))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(uploadimg.routes(), uploadimg.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
