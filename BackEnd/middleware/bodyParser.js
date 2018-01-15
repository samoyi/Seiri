'use strict';


function parse(){
    return (req, res, next)=>{
        if(req.method==='POST' || req.method==='PUT'){


            let buffer = [];
            req.on('data', (chunk)=>{
                console.log('data');
                buffer.push(chunk);
            });
            req.on('file', (name, file)=>{
                console.log('file');
            });
            req.on('end', (data)=>{
                if(req.headers['content-type'].includes('multipart/form-data')){
                    // console.log(Object.keys(req))
                    console.log(req.filename)
                    console.log(buffer[0].filename)
                    this.body = buffer[0].length + '';
                }
                else{
                    this.body = Buffer.concat(buffer).toString();
                }

                next();
            })
        }
        else{
            this.body = '';
            next();
        }
    };
}

module.exports = {
    parse,
};
