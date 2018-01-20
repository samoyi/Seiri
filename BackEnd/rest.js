module.exports = {
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            // 是否是REST API前缀?
            if (ctx.request.path.startsWith(pathPrefix)) {
                // 绑定rest()方法:
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = JSON.stringify(data, null, 4);
                }
                await next();
            }
            else {
                await next();
            }
        };
    }
};
