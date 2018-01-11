
function setCookie(name, value){
    return (req, res, next)=>{
        res.writeHead(200, {
            'Set-Cookie': +name+ '=' +value,
        });
        next();
    }
}

module.exports = {
    setCookie,
};
