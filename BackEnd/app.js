
const Koa = require('koa');
const app = new Koa();

console.log(1);
app.use(async (ctx, next) => {
    console.log(2);
    await next();
    console.log(4);
    ctx.set('Access-Control-Allow-Origin', 'http://localhost');
});
console.log(3);

const rest = require('./rest');
app.use(rest.restify());

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const controller = require('./controller');
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
