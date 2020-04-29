const { exec, escape } = require('../db/mysql')
//获取作者列表相关信息
const getauthorlist = async (username) => {
    let sql = "select * from info where 1=1"
    if (username) {
        sql += ` and username = '${username}'`
    }
    return await exec(sql)
}
//更新作者列表相关信息
const updateauthorlist = async (username, num) => {
    console.log('更新作者列表进入_2', username, num)
    let sql = `update info set article_num = ${num} where username = '${username}'`
    const updateData = await exec(sql);
    if (updateData.affectedRows > 0) {
        console.log('更新作者列表进入_3', username, num)
        return true
    }
    return false
}
//添加新作者
const newauthorlist = async (username, author, article_num) => {
    const sql = `insert  into info (username, author, article_num) value ('${username}', '${author}', ${article_num})`
    const rows = await exec(sql);
    if (rows.affectedRows > 0) {
        return {
            id: rows.insertId,
            isAdd: true
        }
    } else {
        return {
            isAdd: false,
            msg: '未知错误'
        }
    }

}
module.exports = {
    getauthorlist,
    updateauthorlist,
    newauthorlist
}