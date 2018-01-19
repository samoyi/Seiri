const db = {
    users: [
        { name: 'tobi' },
        { name: 'loki' },
        { name: 'jane' }
    ]
};

module.exports = (req, res, next)=>{
    let match = req.url.match(/^\/user\/(.+)/)
    if (match) {
        let user = db.users.filter(user=>{
            return match[1]===user.name;
        });
        if(user[0]) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user[0]));
        }
        else {
            let err = new Error('User not found');
            err.notFound = true;
            next(err);
        }
    } else {
        next();
    }
};
