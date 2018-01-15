
// const connect = require('connect');
// const app = connect();
// const bodyParser = require('./middleware/bodyParser');
//
//
//
// app
// .use(bodyParser.parse())
// .use((req, res, next)=>{
//     res.setHeader('Access-Control-Allow-Origin', 'localhost:80');
//     next();
// })
// .use(function(req, res){
//     res.end(bodyParser.body||'Hoho');
// });
//
// app.listen(3000);



var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

http.createServer(function(req, res) {
  if (req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }
  else{
      res.end();
  }
}).listen(3000);
