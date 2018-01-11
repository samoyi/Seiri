
const connect = require('connect');
const app = connect();
const cookieParser = require('cookie-parser'); // Connect不再包含cookieParser

const cookie = require('./middleware/cookie');
// app.use(cookieParser('tobi is a cool ferret'));
// app.use(function(req, res){
//     console.log('cookies: ' + JSON.stringify(req.cookies));
//     console.log('signedCookies: ' + JSON.stringify(req.signedCookies));
//     res.end('hello\n');
// });

app.use(cookie.setCookie('22', 33));
app.use((req, res)=>{
    res.end('set cookie')
});
app.listen(3000);
