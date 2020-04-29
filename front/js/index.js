
        // 发送 get 请求
        function get(url) {
            return $.get(url)
        }

        // 显示格式化的时间
        function getFormatDate(dt) {
            var date = new Date(dt);
            Y = date.getFullYear() + '-';
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes() + ':';
            s = date.getSeconds();
            return (Y + M + D + h + m + s)
        }

        // 获取 url 参数
        function getUrlParams() {
            let paramStr = location.href.split('?')[1] || ''
            paramStr = paramStr.split('#')[0]
            const result = {}
            paramStr.split('&').forEach(itemStr => {
                const arr = itemStr.split('=')
                const key = arr[0]
                const val = arr[1]
                result[key] = val
            })
            return result
        }

        // 获取 dom 元素
        const $container = $('#blog-container')

        // 拼接接口 url
        let url = '/api/blog/list'
        const urlParams = getUrlParams()
        if (urlParams.author) {
            url += '?author=' + urlParams.author
        }

        // 加载数据
        get(url).then((res) => {
            // console.log(getData)
            // let res = JSON.stringify(getData)
            console.log(res)
            if (res.errno !== 0) {
                alert('数据错误')
                return
            }
            console.log(res.data)
            // 遍历博客列表，并显示
            const data = res.data || []
            data.forEach(item => {
                $container.append($(`
                <div class = 'list-wrapper'>
                    <div class = 'list-top' onclick = 'handelClicktodetai(${item.id})'>
                        <div class = 'title-content-wrapper'>
                            <div class="title-wrapper">
                                <h1 class="title">
                                    <a href="/detail.html?id=${item.id}" target="_blank">${item.title}</a>
                                </h1>
                            </div>
                            <div class = 'showcontent-wrapper'>
                                <p>
                                    ${item.content}
                                </p>
                            </div> 
                        </div>
                    <div class = 'img-wrapper'>
                        <img src = '${item.imgurl}'/>
                    </div>
                    </div>
                    <div class="info-wrapper">
                        <span>
                            作者：
                            <a href="/index.html?author=${item.username}">${item.author}</a>
                        </span>
                        <span>
                            <i class="iconfont">&#xe663;</i>${item.like_num}
                        </span>
                        <span>
                            <i class="iconfont">&#xe665;</i>${item.comment_num}
                        </span>
                        <span>${item.createtime}</span>
                    </div>
                </div>
                `))
            })
        })
        function handelClicktodetai(id) {
            console.log(id)
            location.href = `/detail.html?id=${id}`
        }

        //判断登录状态
        get('/api/user/checkLogin').then((res) => {
            let nav_status_1 = $('.status_1');
            let nav_status_2 = $('.status_2');
            let author_name = $('#author_name');
            let author_img = $('#user_img');
            let management_center = $('#management_center');
            let super_management_center = $('#super_management_center')
            let nav_new_blog = $('#new_blog');
            if (res.errno === 0) {
                if (res.data.superadmin === true) {
                    management_center.hide();
                    super_management_center.show();
                    nav_new_blog.hide();
                }else{
                    management_center.show();
                    super_management_center.hide();
                    nav_new_blog.show();
                }
                author_name.html(res.data.realname)
                author_img.attr('src', `${res.data.user_img}`)
                nav_status_1.hide();
                nav_status_2.show();
            } else {
                nav_status_1.show();
                nav_status_2.hide();
            }
        })

        //监听页面滚动。改变头部导航栏的透明度
        $(document).scroll(function () {
            let H = $(document).scrollTop();
            if (H >= 1) {
                $("#nav-wrapper").hide()
            } else if (H < 1) {
                $("#nav-wrapper").show()
            }
            //显示返回顶部的按钮
            if (H > 200) {
                $('.slide-top').show();
            } else {
                $('.slide-top').hide();
            }
        })
        //返回顶部函数
        $('#slide-top').click(() => {
            $('html, body').animate({ scrollTop: 0 }, 700)
        })
        //
        //导航栏路由跳转
        let home = $('#shouye');
        let management_center = $('#management_center');
        let super_management_center = $('#super_management_center')
        let new_blog = $('#new_blog');
        let login = $('#login');
        let register = $('#register')
        let logout = $('#logout')
        home.click(function () {
            location.href = '/index.html'
        })
        management_center.click(function () {
            location.href = '/admin.html'
        })
        super_management_center.click(() => {
            location.href = '/superadmin.html'
        })
        new_blog.click(function () {
            location.href = '/new.html'
        })
        login.click(function () {
            location.href = '/login.html'
        })
        register.click(() => {
            location.href = '/register.html'
        })
        logout.click(function () {
            //请求退出接口
            get('/api/user/logOut').then((res) => {
                if (res.errno === 0) {
                    location.replace('/index.html')
                    console.log('退出成功')
                }
            })
        })