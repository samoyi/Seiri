var parse = require('url').parse;
module.exports = function route(obj) {
    return function(req, res, next){
        if (!obj[req.method]) {　//检查以确保req.method定义了
            next();
            return;  //如果未定义，调用next()，并停止一切后续操作
        }

        var routes = obj[req.method]  //查找req.method对应的路径
        var url = parse(req.url)  //解析URL，以便跟pathname匹配
        var paths = Object.keys(routes)  //将req.method对应的路径存放到数组中
        for (var i = 0; i < paths.length; i++) {  //遍历路径
            var path = paths[i];
            var fn = routes[path];
            path = path
            .replace(/\//g, '\\/')
            .replace(/:(\w+)/g, '([^\\/]+)');
            var re = new RegExp('^' + path + '$');  //构造正则表达式
            var captures = url.pathname.match(re)
            if (captures) {  //尝试跟pathname匹配
                var args = [req, res].concat(captures.slice(1));  //传递被捕获的分组
                fn.apply(null, args);
                return;  //当有相匹配的函数时，返回，以防止后续的next()调用
            }
        }
        next();
    }
};
