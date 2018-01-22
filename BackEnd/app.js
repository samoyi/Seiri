
const Koa = require('koa');
const app = new Koa();


app.use(async (ctx, next) => {
    await next();
    ctx.set('Access-Control-Allow-Origin', 'http://localhost');
});

const rest = require('./rest');
app.use(rest.restify());

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const controller = require('./controller');
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
