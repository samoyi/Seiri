
const connect = require('connect');
const app = connect();


app
.use(connect.logger())
.use(function(req, res){
    res.end('Yeah');
});

app.listen(3000);
