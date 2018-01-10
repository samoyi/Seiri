
const connect = require('connect');
const app = connect();

const logger = require('./middleware/setup');


app
    .use(logger(':method :url'))
    .listen(3000);
