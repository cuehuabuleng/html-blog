const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp');

//登录
const login = async (username, password) => {
    //判断是否为超级管理员账号
    if (username === 'admin') {
        password = genPassword(password);
        username = escape(username);
        password = escape(password);
        const sql = `select username, adminname from admins where username = ${username} and password = ${password}`
        const rows = await exec(sql)
        console.log('超级管理员登录', rows)
        return rows[0] || {}
    } else {
        //生成加密密码
        password = genPassword(password);
        username = escape(username);
        password = escape(password);

        const sql = `select username, realname from users where username = ${username} and password = ${password}`
        console.log('sql is ', sql)
        const rows = await exec(sql)
        return rows[0] || {}
    }

}
//注册
const register = async (username, password, realname, user_img) => {
    //生成加密密码
    let password_ = genPassword(password);
    console.log('加密后', password_)
    let realname_ = escape(realname);
    let username_ = escape(username);
    let user_img_ = escape(user_img);
    password_ = escape(password_);
    const query_sql1 = `select username, realname from users where realname = ${realname_}`
    const query_sql2 = `select username, realname from users where username = ${username_} `
    const sql = `insert  into users (username, password, realname, user_img) value (${username_}, ${password_}, ${realname_}, ${user_img_})`
    const data_1 = await exec(query_sql1);
    const data_2 = await exec(query_sql2);
    if (data_1[0]) {
        console.log('名字重复', data_1)
        return {
            isRegister: false,
            msg: '名字重复'
        }
    } else if (data_2[0]) {
        return {
            isRegister: false,
            msg: '账号已经被使用过了'
        }
    } else {
        const rows = await exec(sql);
        if (rows.affectedRows > 0) {
            return {
                id: rows.insertId,
                isRegister: true
            }
        } else {
            return {
                isRegister: false,
                msg: '未知错误'
            }
        }
    }
}

//获取用户头像
const getImgurl = async (username) => {
    let rows;
    if (username === 'admin') {
        username = escape(username);
        const sql = `select user_img from admins where username = ${username}`
        console.log('获取用户头像')
        rows = await exec(sql)
    } else {
        username = escape(username);
        const sql = `select user_img from users where username = ${username}`
        console.log('获取用户头像')
        rows = await exec(sql)
    }
    return rows[0] || {}
}

module.exports = {
    login,
    register,
    getImgurl
}