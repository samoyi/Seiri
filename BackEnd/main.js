
const connect = require('connect');
const app = connect();
const bodyParser = require('./middleware/bodyParser');



app
.use(bodyParser.parse())
.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'localhost:80');
    next();
})
.use(function(req, res){
    res.end(bodyParser.body||'Hoho');
});

app.listen(3000);
