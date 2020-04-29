
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
        contentType: "application/json",
    })
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

let username;
let articleId;
let loginStatus;
let articleLikenum;
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
        loginStatus = true;
        username = res.data.username;
        if (res.data.superadmin === true) {
            management_center.hide();
            super_management_center.show();
            nav_new_blog.hide();
        } else {
            management_center.show();
            super_management_center.hide();
            nav_new_blog.show();
        }
        author_name.html(res.data.realname)
        author_img.attr('src', `${res.data.user_img}`)
        nav_status_1.hide();
        nav_status_2.show();
    } else {
        loginStatus = false;
        nav_status_1.show();
        nav_status_2.hide();
    }
})


let isLike;
let footer_likenum = $('#footer_likenum')
let like_num_state1_ = $('#like-num-state1_')
let like_num_state2_ = $('#like-num-state2_')
// 获取 dom 元素  
const $title = $('#title')
const $infoContainer = $('#info-container')
const $content = $('#content')
// 获取数据
const urlParams = getUrlParams()
const url = '/api/blog/detail?id=' + urlParams.id
get(url).then(res => {
    // let res = JSON.parse(getData)
    console.log(res)
    if (res.errno !== 0) {
        alert('数据错误')
        return
    } else {
        //更新页面上的赞数
        footer_likenum.html(res.data.like_num + '赞')
        like_num_state1_.html(res.data.like_num + '赞')
        like_num_state2_.html(res.data.like_num + '赞')
        //加载完数据后，取得文章id，发送点赞查询功能
        // 发送查询点赞状态的参数
        let like_data = {
            articleId: res.data.id
        }
        post('/api/blog/querylike', like_data).then((res) => {
            if (res.errno === 0) {
                if (res.data.isLike === true) {
                    like_num_.classList.add('add_like-num_')
                    click_like[0].classList.add('add-like-num')
                    footer_icon_like.classList.add('add-footer-icon-like')
                } else {
                    like_num_.classList.remove('add_like-num_')
                    click_like[0].classList.remove('add-like-num')
                    footer_icon_like.classList.remove('add-footer-icon-like')
                }
            }
        })
        //显示页面数据
        const data = res.data || {}
        console.log(data)
        articleId = data.id;
        articleLikenum = data.like_num
        let main_left = $('#main-left');
        let nav_title_h2 = $('#nav_title_h2')[0]
        let nav_title_authorimg = $('#nav_title_authorimg')[0]
        let nav_title_author = $('#nav_title_author')[0]
        nav_title_h2.innerText = data.title
        nav_title_author.innerText = data.author
        nav_title_authorimg.src = `${data.author_img}`
        console.log(nav_title_authorimg.src)
        main_left.append($(`
                <h1 id="title" class="title">${data.title}</h1>
                <div class="infor-container">
                    <div class="infor">
                        <a href="" class="author-img">
                            <img src="${data.author_img}" alt="作者图片">
                        </a>
                        <div class="infor-detail">
                            <div class="author-name">
                                <span><a href="">${data.author}</a></span>
                            </div>
                            <div class="article-infor">
                                <span>${data.createtime}</span>
                                <span>
                                    <i class="iconfont">&#xe663;</i> ${data.like_num}
                                </span>
                                <span>
                                    <i class="iconfont">&#xe665;</i> ${data.comment_num}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="blog-article">${data.allcontent}</div>
                `))
    }
})
//点赞
let click_like = $('#like-icon')
let like_num_ = $('.like-num_')[0];
let footer_icon_like = $('#footer-icon-like')[0]
click_like.click(() => {
    if (loginStatus === true) {
        //判断点赞状态
        let like_data = {
            articleId: articleId
        }
        post('/api/blog/querylike', like_data).then((res) => {
            if (res.data.isLike === true) {
                //点赞数量减一,并且删除点赞记录
                let data = {
                    addlike: false,
                    articleId: articleId,
                    articleLikenum: articleLikenum - 1
                }
                post('/api/blog/addlike', data).then((res) => {
                    console.log('减一', res)
                    if (res.errno === 0) {
                        like_num_.classList.remove('add_like-num_')
                        click_like[0].classList.remove('add-like-num')
                        footer_icon_like.classList.remove('add-footer-icon-like')
                        //刷新当前页面的赞数
                        const url = '/api/blog/detail?id=' + urlParams.id
                        get(url).then((res) => {
                            if (res.errno === 0) {
                                articleLikenum = res.data.like_num
                                // 更新赞数
                                footer_likenum.html(res.data.like_num + '赞')
                                like_num_state1_.html(res.data.like_num + '赞')
                                like_num_state2_.html(res.data.like_num + '赞')
                            }
                        })
                    }
                })
            } else {
                //点赞数量加一,增加点赞记录
                let data = {
                    addlike: true,
                    articleId: articleId,
                    articleLikenum: articleLikenum + 1
                }
                post('/api/blog/addlike', data).then((res) => {
                    console.log('加一', res)
                    if (res.errno === 0) {
                        like_num_.classList.add('add_like-num_')
                        click_like[0].classList.add('add-like-num')
                        footer_icon_like.classList.add('add-footer-icon-like')
                        //刷新当前页面的赞数
                        const url = '/api/blog/detail?id=' + urlParams.id
                        get(url).then((res) => {
                            if (res.errno === 0) {
                                articleLikenum = res.data.like_num
                                // 更新赞数
                                footer_likenum.html(res.data.like_num + '赞')
                                like_num_state1_.html(res.data.like_num + '赞')
                                like_num_state2_.html(res.data.like_num + '赞')
                            }
                        })
                    }
                })

            }
        })


    } else {
        alert('请先登录')
    }
})

//评论
$("#comment-textarea").click(function () {
    $("#comment-textarea")[0].classList.add('add_textarea_class')
    $('#footer-comment-button').show();
    $('#footer-icon').hide();
})
//取消评论
$('#btn-cancle').click(() => {
    $("#comment-textarea")[0].classList.remove('add_textarea_class')
    $('#footer-comment-button').hide();
    $('#footer-icon').show();
})
//发布评论
$('#btn-comfirm').click(() => {
    get('/api/user/checkLogin').then((res) => {
        if (res.errno === 0) {
            $("#comment-textarea")[0].classList.remove('add_textarea_class')
            $('#footer-comment-button').hide();
            $('#footer-icon').show();
            alert('发布成功')
        } else {
            alert('请先登录')
        }
    })

})
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

$(document).scroll(() => {
    let H = $(document).scrollTop();
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

//头部导航栏动画事件
let nav = $('#nav')[0];
let nav_title = $('#nav_title')[0]
function scroll() {
    //console.log("打印log日志");实时看下效果
    console.log("开始滚动！");
}

var scrollFunc = function (e) {
    e = e || window.event;
    if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件    
        if (e.wheelDelta > 0) { //当滑轮向上滚动时 
            nav.classList.remove('add_nav');
            nav_title.classList.remove('add_nav_title')
        }
        if (e.wheelDelta < 0) { //当滑轮向下滚动时 
            nav.classList.add('add_nav');
            nav_title.classList.add('add_nav_title')
        }
    } else if (e.detail) { //Firefox滑轮事件 
        if (e.detail > 0) { //当滑轮向上滚动时 
            nav.classList.remove('add_nav');
            nav_title.classList.remove('add_nav_title')
        }
        if (e.detail < 0) { //当滑轮向下滚动时 
            nav.classList.add('add_nav');
            nav_title.classList.add('add_nav_title')
        }
    }
}
//给页面绑定滑轮滚动事件 
if (document.addEventListener) {//firefox 
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}
//滚动滑轮触发scrollFunc方法 //ie 谷歌 
window.onmousewheel = document.onmousewheel = scrollFunc;
