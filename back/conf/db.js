const env = process.env.NODE_ENV; //环境参数

//配置
let MYSQL_CONF;
let REDIS_CONF;

if (env === 'dev') {
    //mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '685313',
        port: '3306',
        database: 'myblog',
        useConnectionPooling: true
    }

    //redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    //mysql
    MYSQL_CONF = {
        host: '114.55.93.74',
        user: 'root',
        password: '@Chen1079713849',
        port: '3306',
        database: 'myblog'
    }

    //redis
    REDIS_CONF = {
        port: 6379,
        host: '114.55.93.74'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
