const Koa = require('koa');
const app = new Koa();

const one = async (ctx, next) => {
  console.log(1);
  await next();
  console.log(6);
}

const two = async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
}

const three = async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
}

app.use(one);
app.use(two);
app.use(three);

app.listen(3000);
