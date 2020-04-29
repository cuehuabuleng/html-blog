const router = require('koa-router')()
const formidable = require('koa-formidable'); // 图片处理
const fs = require('fs'); // 图片路径
const path = require('path'); // 图片路径

const { 
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog'); 
const { SuccessModal, ErroModal} = require('../model/resModel');
const loginCheck = require('../middleeware/loginCheck')

router.prefix('/api/blog')

const uploadUrl = "http://localhost:8000/static/img/blog";
//博客文章图片路由
router.post('/uploadimg',loginCheck, async function(ctx, next){
    const file = ctx.request.files.pic1;
    console.log('上传文件',file)
      // 读取文件流
    const fileReader = fs.createReadStream(file.path);
    // console.log('文件读取流',fileReader);
    const filePath = path.join(__dirname, '../static/img/blog');
      // 组装成绝对路径
    const fileResource = filePath + `/${file.name}`;
    /*
   使用 createWriteStream 写入数据，然后使用管道流pipe拼接
  */
    const writeStream = fs.createWriteStream(fileResource);
    console.log('是否存在',fs.existsSync(filePath))
     // 判断 /static/img/blog 文件夹是否存在，如果不在的话就创建一个
     if (!fs.existsSync(filePath)) {
         console.log('1')
         console.log('文件路径',filePath )
        fs.mkdir(filePath, (err) => {
            console.log('文件路径1',filePath )
            console.log('错误',err)
          if (err) {
            throw new Error(err);
          } else {
            fileReader.pipe(writeStream);
            ctx.body = new SuccessModal({
                url: uploadUrl + `/${file.name}`,
                message: '上传成功'
              });
          }
        }); 
      } else {
        fileReader.pipe(writeStream);
        ctx.body = new SuccessModal({
            url: uploadUrl + `/${file.name}`,
            message: '上传成功'
          });
      }
})

  module.exports = router;