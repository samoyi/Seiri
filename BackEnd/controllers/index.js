const {APIError} = require('../middlewares/forREST');

var fn_index = async (ctx, next) => {
    ctx.response.body = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport"
			content="width=device-width, user-scalable=no, initial-scale=1.0" />
        <meta
        <title>断 舍 离</title>
        </head>
        <body>
            <h1>断 舍 离</h1>
            <form action="/signin" method="post">
                <p>邮箱：<input name="name" type="text" value="leening529@163.com"></p>
                <p>密码：<input name="password" type="password" value="123456qwerty"></p>
                <p><input type="submit" value="登录"></p>
                <p><input type="submit" value="注册"></p>
                <p><input type="submit" value="重置密码"></p>
                <p>测试密码：123456qwerty</p>
            </form>
            <div>
                <h2>优点或者缺点</h2>
                <p>
                    <h3>纯净</h3>
                    没有广告、没有社交、没有签到、没有积分、没有商城……
                </p>
                <p>
                    <h3>节制</h3>
                    最多只能创建四个项目<br />
                    你必须要考虑什么东西对你来说才是真正重要的
                </p>
                <p>
                    <h3>隐私</h3>
                    只需要邮箱和密码就可以使用所有功能，不会收集包括手机号在内的任何
                    个人信息
                </p>
                <p>
                    <h3>稳定</h3>
                </p>
                <p>
                    <h3>安全</h3>
                </p>
                <p>
                    <h3>收费</h3>
                    收费是这款产品唯一的盈利方式<br />
                    免费试用6个月，之后必须要付费才能使用
                </p>
            </div>
        </body>
        </html>
        `;
};

var fn_signin = async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        a
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
        // throw new APIError('auth:user_not_found', 'user not found');
    }
};

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin
};
