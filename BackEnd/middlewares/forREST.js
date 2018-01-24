module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/'; // api请求的路径
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                // 如果是api请求，则给ctx绑定rest()方法，方便之后统一处理
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    await next();
                }
                catch (e) {
                    // 返回错误:
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            }
            else{
                await next();
            }
        };
    }
};
