// <!-- 初始化Quill编辑器 -->
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['image'],
    ['clean']                                         // remove formatting button
];
var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: toolbarOptions
    }
});
quill.getModule("toolbar").addHandler("image", uploadImageHandler)

//获取隐藏input储存图片的节点
function uploadImageHandler() {
    const input = document.querySelector('#uploadImg')
    input.value = ''
    input.click()
}

//监听隐藏input， 实现图片上传 
$('#uploadImg').change((e) => {
    let formData = new FormData()
    let pic = e.target.files[0]
    let _this = this;
    formData.append('pic1', pic)
    $.ajax({
        url: '/api/blog/uploadimg',
        data: formData,
        type: 'post',
        cache: true, //上传文件不需要缓存
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (data) {
            if (data.errno === -1) {
                alert('尚未登录,请前往登录')
            } else {
                console.log(data)
                const addImageRange = _this.quill.getSelection()
                console.log(addImageRange)
                const newRange = 0 + (addImageRange !== null ? addImageRange.index : 0)
                _this.quill.insertEmbed(newRange, 'image', data.data.url)
                _this.quill.setSelection(1 + newRange)
            }
        },
        error: function (error) {
            console.error(error)
        }
    })
})

// 发送 post 请求
function post(url, data = {}) {
    return $.ajax({
        type: 'post',
        url,
        data: JSON.stringify(data),
        contentType: 'application/json',
    })
}
// 发送 get 请求
function get(url) {
    return $.get(url)
}

//全局定义头像 和realname
let user_img;
let author_realname;
//定义获取和操作作者列表的需要参数
let username;
let articlenum;
// 判断登录状态，并且获取头像信息和realnanme
get('/api/user/checkLogin').then((res) => {
    username = res.data.username;
    if (res.errno === 0) {
        user_img = res.data.user_img;
        author_realname = res.data.realname;
    } else {
        alert('尚未登录,请前往登录')
    }
})

//获取本作者文文章列表相关信息(标题，时间)
let url = '/api/blog/list?isadmin=1';
let blog_list = $('#blog-list');
get(url).then((res) => {
    if (res.errno === 0) {
        let data = res.data;
        data.forEach((item) => {
            blog_list.append($(`
        <li onclick = "handleClickEdit(${item.id})" id = "_${item.id}">
            <i class="iconfont document">&#xe610;</i>
            <span>${item.title}</span>
            <i class="iconfont set" >&#xe771;</i>
        </li>
        `))
        })
    } else if (res.errno === -1) {
        alert('尚未登录，请前往登录')
    }
})

//右侧导航栏路由跳转
let nav_write = $('#nav-write');
let nav_maneger = $('#nav-manager')
nav_write.click(() => {
    location.href = '/new.html'
})
nav_maneger.click(() => {
    location.href = '/admin.html'
})
//点击文章标题，进行修和查看
function handleClickEdit(id) {
    let url = `/api/blog/detail?id=${id}`
    this.get(url).then((res) => {
        if (res.errno === 0) {
            console.log(id)
            let title = res.data.title
            let html = res.data.allcontent
            console.log(res)
            this.quill.pasteHTML(html)
        } else if (res.errno === -1) {
            alert('登陆超时,请前往登陆')
            location.href = '/login.html'
        }
    })
}
//新建文章
$('#new_blog').click(() => {
    let html = document.querySelector('#editor').children[0].innerHTML;
    let _this = this;
    if (html) {
        html = '<p style="color: rgb(230, 0, 0);">请开始写你的新文章</p>'
        _this.quill.pasteHTML(html)
        _this.quill.setSelection(9)
    } else {
        html = '<p style="color: rgb(230, 0, 0);">请开始写你的新文章</p>'
        _this.quill.pasteHTML(html)
    }
    console.log(html)
})
//发表文章按钮
$('#new_submit').click(() => {
    //获取作者的文章数量并且加一    
    const url_ = '/api/admin/authorlist?username=' + username
    get(url_).then((res) => {
        console.log(res.data[0].article_num)
        articlenum = res.data[0].article_num + 1
    })
    //新建文章
    let html = document.querySelector('#editor').children[0].childNodes
    let length = html.length
    let contentList = []
    let titleList = []
    let imgList = []
    let title = '';
    let content = '';
    let imgurl = ''
    console.log(html, length)
    for (let i = 0; i < length; i++) {
        const elementName = html[i].nodeName;
        // console.log(html[i].firstChild.nodeName)
        //找出标题元素
        if (elementName === 'H1' || elementName === 'H2') {
            titleList.push(html[i])
        }
        //找出图片元素h和内容元素
        if (elementName === 'P') {
            if (html[i].firstChild.nodeName === 'IMG') {
                imgList.push(html[i].firstChild)
            } else if (html[i].firstChild.nodeName != 'H1' || html[i].firstChild.nodeName != 'H2') {
                contentList.push(html[i])
            }
        }
    }
    console.log('标题list', titleList)
    console.log('内容list', contentList)
    console.log('图片list', imgList)
    //给标题赋值
    if (titleList.length > 0) {
        for (let i = 0; i < titleList.length; i++) {
            if (titleList[i].nodeName === 'H1' && titleList[i].innerHTML !== '<br>') {
                title = titleList[i].innerText
                console.log('h1', title)
            } else if (titleList[i].nodeName === 'H2') {
                title = titleList[i].innerText
                console.log('h2', title)
            }
        }
    } else {
        title = '无标题'
    }

    //获取内容
    if (contentList.length > 0) {
        for (let i = 0; i < contentList.length; i++) {
            content += contentList[i].innerText
        }
    } else {
        content = '暂无文字描述'
    }
    content = content.slice(0, 40 + Math.floor(Math.random() * 10)) + '...';
    //获取第一张图片url
    if (imgList.length > 0) {
        imgurl = imgList[0].src
    } else {
        imgurl = 'http://localhost:8000/static/img/blog/L612XXX0C53R_e3_500.jpg'
    }

    // console.log('标题', title)
    // console.log('内容', content)
    // console.log('图片', imgurl)
    let allcontent = document.querySelector('#editor').children[0].innerHTML
    const url = '/api/blog/new'

    if (length === 1 && html[0].innerHTML === '<br>') {
        alert('请先输入内容再提交')
    } else {
        const data = {
            title,
            content: content,
            imgurl,
            allcontent,
            user_img,
            author_name: author_realname
        }
        console.log(data)
        post(url, data).then(res => {
            // let res = JSON.parse(getData);
            console.log(res)
            if (res.errno !== 0) {
                if (res.message === '未登录') {
                    alert('尚未登录')
                    location.href = '/login.html'
                }
                return
            }
            //文章数加一
            const url = '/api/admin/updateauthorlist?username=' + username + '&article_num=' + articlenum
            console.log('文章数量', articlenum)
            get(url).then((res) => {
                console.log(res)
            })
            alert('创建成功')
            location.href = '/admin.html'
        })
    }
})
