const xss = require('xss');
const { exec, escape } = require('../db/mysql');
const { getFormatDate } = require('../utils/format')
// 获取博列表
const getList = async (username, keyword ) => {
    let sql = "select * from blohs where 1=1"
    if (username) {
        sql  += ` and username = '${username}'`
    }
    if (keyword) {
        sql += ` and title like '%${keyword}%';`
        // sql += " and title like '%"+keyword+"%'"
    }
    // sql += `order by createtime desc;`  //!!发生错误
    //返回promise
    return await exec(sql)
}

// 获取博客详情
const getDetail = async (id) => {
    const sql = `select * from blohs where id = '${id}'`
    const rows = await exec(sql)
    console.log('博客详情 编辑', rows[0])
    return rows[0]

}

// 新建一篇博客
const newBlog = async (blogData = {}) => {
    //blogDta 是一个博客对象， 包括 title content author属性
    console.log('发过来的数据',blogData)
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    const imgurl = xss(blogData.imgurl);
    const allcontent = xss(blogData.allcontent);
    const author = xss(blogData.author_name);
    const author_img = xss(blogData.user_img)
    const username = xss(blogData.author)
    const createtime = xss(getFormatDate(Date.now()));
    console.log('create time is',createtime)
    const sql = `
    insert into blohs (title, content, createtime, author, imgurl, allcontent, author_img, username)
    value ('${title}', '${content}', '${createtime}', '${author}','${imgurl}', '${allcontent}', '${author_img}', '${username}')
    `

    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
} 

//博客点赞接口
const likeBlog = async (data = {}) => {
    console.log('点赞接口传递数据:',data)
    let sql;
    const { username, articleId, addlike, articleLikenum } = data;
    //判断增加赞数还是减少赞数，删除点赞记录还是增加点赞记录
    if (addlike === true) {
        sql = `insert into like_info (author_like, article_beliked)
        value ('${username}', ${articleId})
       `
    } else{
        sql = `delete from like_info where author_like = '${username}' and article_beliked = ${articleId}
       ` 
    }
    const updatesql = `update blohs set like_num = ${articleLikenum} where id = ${articleId};`
    const insertData = await exec(sql);
    const updateData = await exec(updatesql);
    console.log('删除或者增加点赞记录', insertData)
    console.log('更新点赞数', updateData)
    if (updateData.affectedRows > 0) {
        return {
            isUpdate:true,
            id:insertData.insertId
        }
    }
    return {
        isUpdate:false,
        id:insertData.insertId
    }
}
//查询是否点赞
const queryLike = async (data = {}) => {
    console.log('查询点赞接口传递数据:', data)
    const username = data.username;
    const articleId = data.articleId;
    let articleIdList = [];
    const sql = `select article_beliked from like_info  where author_like = '${username}'` 
    const queryData = await exec(sql);
    if (queryData.length === 0) {
        return {
            isLike:false
        }
    }else{
        console.log('查询出来的点赞数据',queryData[0].article_beliked)
        for (let i = 0; i < queryData.length; i++) {
            articleIdList.push(queryData[i].article_beliked);
        }
        console.log('拼装好的数据', articleIdList)
        if (articleIdList.indexOf(articleId) > -1) {
            console.log('已经点赞')
            return{
                isLike:true
            }
        }else{
            console.log('未点赞')
            return{
                isLike:false
            }
        }
    }
}
// 更新一篇博客
const updateBlog = async (id , blogData = {}) => {
    //id 就是要更新博客的id
    //blogDta 是一个博客对象， 包括 title content 属性
    const title = blogData.title;
    const content = blogData.content;
    const imgurl = xss(blogData.imgurl);
    const allcontent = xss(blogData.allcontent);
    const author = xss(blogData.author_name);
    const author_img = xss(blogData.user_img)
    const createtime = Date.now();
    console.log('blogData is ', blogData)
    const sql = `update blohs set title = '${title}',content = '${content}',createtime = '${createtime}', author = '${author}', imgurl = '${imgurl}', allcontent = '${allcontent}', author_img = '${author_img}' where id = ${id}`

    const updateData = await exec(sql);
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

// 删除博客
const delBlog = async (id, author) => {
    // console.log('3', id)
    const sql = `delete from blohs where id = ${id} and username = '${author}'`
    const delData = await exec(sql);
    console.log('controller delete', delData)
    if (delData.affectedRows > 0) {
        return true;
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    likeBlog,
    queryLike
}