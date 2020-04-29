//获取属性
function getStyle(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    } else {
        return getComputedStyle(obj, true)[name];
    }
}
//obj表示运动的物体,json运动的属性,fnEnd链式运动的函数
function starMove(obj, json, fnEnd) {
    //移除定时器
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        //假定所有运动的属性都结束
        var bStop = true;
        //遍历需要同时运动的属性
        for (var attr in json) {
            //获得运动属性的当前运动值
            var cur = 0;
            if (attr == 'opacity') {
                cur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
            } else {
                cur = parseInt(getStyle(obj, attr));
            }
            //计算速度
            var speed = (json[attr] - cur) / 6;
            //速度需要取整
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            //判断如果有属性没有结束,则为false
            if (cur != json[attr]) bStop = false;
            //开始运动增减
            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + cur + speed + ');'
                obj.style.opacity = (cur + speed) / 100;
            } else {
                obj.style[attr] = cur + speed + 'px';
            }
        }
        //最后运动结束
        if (bStop == true) {
            //关闭定时器
            clearInterval(obj.timer);
            //执行链式函数
            if (fnEnd) fnEnd();
        }
    }, 30)
}