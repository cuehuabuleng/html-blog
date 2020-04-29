window.onload = function () {
    // 发送 get 请求
    function get(url) {
        return $.get(url)
    }

    // 发送 post 请求
    function post(url, data = {}) {
        return $.ajax({
            type: 'post',
            url,
            data: JSON.stringify(data),
            contentType: "application/x-www-form-urlencoded",
        })
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
    // 获取 dom 元素
    const $textKeyword = $('#text-keyword')
    const $btnSearch = $('#btn-search')
    const $tableContainer = $('#table-container')

    // 拼接接口 url
    let url = '/api/blog/list?isadmin=1'
    const urlParams = getUrlParams()
    console.log(urlParams.key)
    if (urlParams.keyword) {
        url += '&keyword=' + urlParams.keyword
    }
    if (urlParams.key) {
        url += '&username=' + urlParams.key
    }

    // 加载数据
    get(url).then(res => {
        // let res = JSON.parse(getData)
        $('#admin-author-name')[0].innerText = res.data[0].author
        if (res.errno !== 0) {
            // alert('数据错误')
            return
        }

        // 显示作者数据
        const data = res.data || []
        data.forEach(item => {
            $tableContainer.append($(`
                <tr>
                    <td>
                        <a>${item.title}</a>
                    </td>
                    <td>
                        <a>${item.createtime}</a >
                    </td>
                    <td>
                        <a data-id="${item.id}" class="item-del">删除</a>
                    </td>
                </tr>
            `))
        })
    })

    // 搜索
    $btnSearch.click(() => {
        const keyword = $textKeyword.val()
        console.log(keyword)
        location.href = '/admin.html?keyword=' + keyword
    })

    // 删除
    $tableContainer.click(e => {
        let username = urlParams.key
        let articlenum;

        //获取作者的文章数
        const url = '/api/admin/authorlist?username=' + username
        get(url).then((res) => {
            console.log(res.data[0].article_num)
            articlenum = res.data[0].article_num-1
        })
        //删除博客
        const $target = $(e.target)
        if ($target.hasClass('item-del') === false) {
            return
        }
        if (confirm('确定删除？')) {

            const url = '/api/blog/del?id=' + $target.attr('data-id') + '&username=' + username
            post(url).then(res => {
                // let res = JSON.parse(getData)
                console.log(res)
                if (res.errno !== 0) {
                    alert('操作错误')
                    return
                }
                //文章数减一
                const url = '/api/admin/updateauthorlist?username=' + username +'&article_num='+articlenum
                console.log('文章数量',articlenum)
                get(url).then((res) => {
                    console.log(res)
                })
                alert('删除成功')
                location.href = location.href
            })
        }
    })

    //判断登录状态
    get('/api/user/checkLogin').then((res) => {
        let nav_status_1 = $('.status_1');
        let nav_status_2 = $('.status_2');
        let author_name = $('#author_name');
        let author_img = $('#user_img');
        if (res.errno === 0) {
            author_name.html(res.data.realname)
            author_img.attr('src', `${res.data.user_img}`)
            nav_status_1.hide();
            nav_status_2.show();
        } else {
            nav_status_1.show();
            nav_status_2.hide();
        }
    })

    //导航栏路由跳转
    let home = $('#shouye');
    let management_center = $('#management_center');
    let new_blog = $('#new_blog');
    let login = $('#login');
    let register = $('#register')
    let logout = $('#logout')
    home.click(function () {
        location.href = '/index.html'
    })
    management_center.click(function () {
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
}