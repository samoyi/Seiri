module.exports = (req, res, next)=>{
    if (req.url.match(/^\/pet\/(.+)/)) {
        foo();
    }
    else {
        next();
    }
};
