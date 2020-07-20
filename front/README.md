# 前端部分

# 先下载好整个文件

# 使用命令行进入到front，执行命令 
--npm install

# 安装好依赖之后，就执行

--http-server -p 8001

# 执行完之后，就可以访问 http://localhost:8080/index.html

<!-- ---本项目使用了nginx反向代理，由于前端端口为8001，后端端口为8000，所以会产生跨域问题，
--使用ngixn监听8080端，将前后端代理到本端口来，实现跨域请求。 -->