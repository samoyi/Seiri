module.exports = (req, res, next)=>{
    res.statusCode = 404;
    res.end('Page Not found');
};
