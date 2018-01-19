

let str = 22;

let num = 123;

function hi(){
    console.log(str)
}

setTimeout(()=>{
    // hi = function(){console.log(666)}
    num = 321;
}, 1000);

module.exports = {
    hi,
    num,
};
