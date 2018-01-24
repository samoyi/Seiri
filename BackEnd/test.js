const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

const a = 2
[ 3, 4 ].forEach(n => console.log(n))



app.listen(3000);

console.log('listening on port 3000');
