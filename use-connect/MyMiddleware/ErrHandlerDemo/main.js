
const connect = require('connect');

const app = connect();
const api = connect();

const hello = require('./middleware/hello');
const users = require('./middleware/users');
const pets = require('./middleware/pets');
const errorHandler = require('./middleware/errorHandler');
const errorPage = require('./middleware/errorPage');

api.use(users)
    .use(pets)
    .use(errorHandler);

app.use(hello)
    .use('/api', api)
    .use(errorPage)
    .listen(3000);
