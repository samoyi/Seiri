const url = require('url');
const querystring = require('querystring');

// const { URL } = require('url');

function parse(){
    return (req, res, next)=>{
        console.log(req.url)
        // const myURL = url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash', true);
        const myURL = url.parse(req.url, true);
        console.log(myURL)
        this.query = myURL.query;
        // let arr = req.url.split('?');
        // if(arr.length>1){
        //     this.query = querystring.parse(arr[1]);
        // }
        // else{
        //     this.query = null;
        // }
        next();
    };
}


module.exports = {
    parse,
};
