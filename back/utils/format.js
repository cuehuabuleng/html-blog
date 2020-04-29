function getFormatDate(dt) {
    var date = new Date(dt);
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return (`${Y + M + D + h + m + s}`)
}

module.exports = {
    getFormatDate
}