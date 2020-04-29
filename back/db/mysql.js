const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

//创建连接池对象
const con = mysql.createPool(MYSQL_CONF);

//统一执行sql的函数
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        //开始连接
        con.getConnection(function(err, connection)  {
            console.log('sql函数', sql)
            if (err) {
                 throw err
            } else {
                connection.query(sql, function (err, rows) {
                    if (err) {
                        reject(err)
                        return
                    } else {
                        resolve(rows)
                    }
                })
                connection.release();
            }
        })
    })
    return promise;
}

module.exports = {
    exec,
    escape: mysql.escape
}