
const SignedCookieSeparator = '|';

const crypto = require('crypto');
const sha256 = crypto.createHash('sha256');


let hmac = '';
function setKey(sKey){
    // 参考这个  https://www.zhihu.com/question/19816240
    if(typeof sKey === 'string' && sKey){
        if(sKey.length>64){
            sha256.update(sKey);
            sKey = sha256.digest('hex');
        }
        hmac = crypto.createHmac('sha256', sKey);
    }
    else{
        throw new TypeError('Parameter expected a non-empty string');
    }
}


function _setCookie(sName, sValue, oConfig){

    let oDefaultConfig = {
        httpOnly: true,
        secure: true,
    };

    oConfig = Object.assign(oDefaultConfig, oConfig);
    let sConfig = '';
    for(let key in oConfig){
        if(oConfig[key]!==false){
            sConfig += ';' + key + '=' + oConfig[key];
        }
    }

    return (req, res, next)=>{
        res.writeHead(200, {
            'Set-Cookie': sName+ '=' +sValue+ sConfig,
        });
        next();
    }
}


function setCookie(sName, sValue, oConfig){
    if(sValue.includes(SignedCookieSeparator)){
        throw new Error('"' + SignedCookieSeparator
                        + '" is separator for signed cookie separator');
    }
    return _setCookie(sName, sValue, oConfig);
}


function setSignedCookie(sName, sValue, oConfig){
    if(hmac){
        hmac.update(sValue);
        sValue = sValue +SignedCookieSeparator+ hmac.digest('hex');
        return _setCookie(sName, sValue, oConfig);
    }
    else{
        throw new TypeError('Signed Cookie needs a key set by setKey');
    }
}


// Check the value of a cookie to determine whether it is a normal cookie or a
// signed cookie。If it is a signed cookie, check its signature.
function checkCookie(sCookieValue){
    let arr = sCookieValue.split(SignedCookieSeparator);
    if(arr.length===1){
        return sCookieValue;
    }
    if(arr.length===2){ // signed cookie
        hmac.update(arr[0]);
        if(hmac.digest('hex')===arr[1]){
            return arr[0];
        }
    }
    return false;
}


function getCookies(fnCallback){
    return (req, res, next)=>{
        let sCookies = req.headers.cookie,
            oCookies = {};
        if(sCookies){
            let aPair = [];
            sCookies.split(';').forEach(cookie=>{
                aPair = cookie.split('=');
                if(checkCookie(aPair[1])===false){
                    oCookies[aPair[0]] = aPair[1];
                }
            });
        }
        fnCallback && fnCallback(oCookies);
        next();
    };
}


module.exports = {
    setCookie,
    setKey,
    setSignedCookie,
    getCookies,
};
