
// 不能处理文件上传
function parse(){
    return (req, res, next)=>{
        if(req.method==='POST' || req.method==='PUT'){


            let buffer = [];
            req.on('data', (chunk)=>{
                buffer.push(chunk);
            });
            req.on('end', (data)=>{
                if(req.headers['content-type'].includes('multipart/form-data')){
                    // 不能处理文件上传
                    this.body = '不能处理文件上传';
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
