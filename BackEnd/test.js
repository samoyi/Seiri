const Koa = require('koa');
const compose = require('koa-compose');
const app = new Koa();



const fs = require('fs');
const {promisify} = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

app.use(async function (ctx, next) {


    console.log('1 ' + Date.now());
  const paths = await readdir('Doc');
  console.log('2 ' + Date.now());
  const files = await Promise.all(paths.map(path => readFile(`Doc/${path}`, 'utf8')));
console.log('3 ' + Date.now());
await next();
  ctx.type = 'markdown';
  ctx.body = Date.now() + files.join('<br /><br />');
});


function logger(format) {
  format = format || ':method ":url"';

  return async function (ctx, next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);

    console.log(Date.now() + ' ' + str);

    await next();
  };
}
app.use(logger());


app.listen(3000);
