const { ErroModal } =require('../model/resModel');

module.exports = async (ctx, next) => {
    if (ctx.session.username) {
        await next();
        return;
    }
    ctx.body = new ErroModal('未登录')
}