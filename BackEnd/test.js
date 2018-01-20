const User = require('./modules/User');

let user = new User('user1');


user.addProject('第三个')
    .then((res)=>{
        console.log(res);
    });



console.log(22);
console.log(33);
