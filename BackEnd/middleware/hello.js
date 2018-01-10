
module.exports = (req, res, next)=>{
    if(req.url.match(/^\/hello/)){
        res.end('Hello World\n');
    }
    else{
        next();
    }
};
