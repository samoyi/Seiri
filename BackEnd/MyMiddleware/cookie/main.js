
const connect = require('connect');
const app = connect();

const cookie = require('./cookie');


cookie.setKey('virtual')

app.use(cookie.getCookies(cookies=>{
    console.log(cookies);
}));
app.use(cookie.setCookie('name', 'siro', {secure: false}));
app.use(cookie.setSignedCookie('age', '16', {secure: false}));
app.use((req, res)=>{
    res.end('set cookie.')
});


app.listen(3000);
