window.onload = function () {
    //发送post请求
    function post(url, data = {}) {
        return $.ajax({
            type: 'post',
            url,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
    }

    //注册请求
    $('#register_btn').click(() => {
        let realname = $('#register_realname').val();
        let username = $('#register_username').val();
        let password = $('#register_password').val();
        let num = Math.floor(Math.random() * 13);
        let user_img = './img/touxiang/' + num + '.jpg'
        let url = '/api/user/register';
        if (username === 'admin') {
            alert('该账号已经存在,请重新注册'),
                username = ''
        } else {
            let data = {
                realname,
                username,
                password,
                user_img
            }
            console.log(data)
            if (realname === '') {
                $('#register_realname')[0].style.border = '1px solid red'
                $('#register_realname')[0].placeholder = '请输入名字'
            } else if (username === '') {
                $('#register_realname')[0].style.border = 'none'
                $('#register_username')[0].style.border = '1px solid red'
                $('#register_username')[0].placeholder = '请输入账号'
            } else if (password === '') {
                $('#register_username')[0].style.border = 'none'
                $('#register_password')[0].style.border = '1px solid red'
                $('#register_password')[0].placeholder = '请输入密码'
            } else {
                $('#register_password')[0].style.border = '1none'
                post(url, data).then((res) => {
                    console.log(res)
                    if (res.errno === 0) {
                        alert('注册成功!!')
                        console.log('注册成功')
                        location.href = '/login.html'
                    } else {
                        alert(res.message)
                    }
                })
            }
        }
    })
}