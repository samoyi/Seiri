module.exports = (err, req, res, next)=>{
    res.setHeader('Content-Type', 'application/json');
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: err.message }));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        console.error(err.stack);
    }
};
