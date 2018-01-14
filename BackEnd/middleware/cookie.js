
const SignedCookieSeparator = '|';

const crypto = require('crypto');
const sha256 = crypto.createHash('sha256');


let hmac = null,
    sSignatureKey = '';
function setKey(sKey){
    sSignatureKey = sKey.trim();

    // 参考这个  https://www.zhihu.com/question/19816240
    if(typeof sSignatureKey === 'string' && sSignatureKey){
        if(sSignatureKey.length>64){
            sha256.update(sSignatureKey);
            sSignatureKey = sha256.digest('hex');
        }
        hmac = crypto.createHmac('sha256', sSignatureKey);
    }
    else{
        throw new TypeError('Parameter expected a non-empty string');
    }
}


let aCookie = []; // All the cookies to be set
let aSingedCookieName = [];

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

    // Set-Cookie header will be constantly updated when setting multiple
    // cookies, until the last cookie is set, Set-Cookie header will contain all
    // the cookies.
    aCookie.push(sName+ '=' +sValue+ sConfig);
    return (req, res, next)=>{
        res.writeHead(200, {
            'Set-Cookie': aCookie,
        });
        next();
    }
}


function setCookie(sName, sValue, oConfig){
    sName = sName.trim();
    sValue = sValue.trim();

    if(sValue.includes(SignedCookieSeparator)){
        throw new Error('"' + SignedCookieSeparator
                        + '" is separator for signed cookie separator');
    }
    return _setCookie(sName, sValue, oConfig);
}


function setSignedCookie(sName, sValue, oConfig){
    sName = sName.trim();
    sValue = sValue.trim();

    if(hmac){
        aSingedCookieName.push(sName);
        hmac.update(sValue);
        sValue = sValue + SignedCookieSeparator + hmac.digest('hex');
        hmac = crypto.createHmac('sha256', sSignatureKey);
        return _setCookie(sName, sValue, oConfig);
    }
    else{
        throw new TypeError('Signed Cookie needs a key set by setKey');
    }
}


// Check a cookie to determine whether it is a normal cookie or a signed cookie.
// If is a normal cookie, cookie value will be returned directly.
// If it is a signed cookie, check its signature. If the signature is wrong,
// this function will rerutn false, or returns the unsigned cookie value.
function checkCookie(sCookieName, sCookieValue){

    if(aSingedCookieName.includes(sCookieName)){
        // This cookie should be a signed cookie
        let arr = sCookieValue.split(SignedCookieSeparator);

        if(arr.length===2){ // signed cookie
            hmac.update(arr[0]);
            let hash = hmac.digest('hex');
            hmac = crypto.createHmac('sha256', sSignatureKey);
            if(hash===arr[1]){
                return arr[0];
            }
        }
    }
    else{
        return sCookieValue;
    }

    return false;
}


function getCookies(fnCallback){
    return (req, res, next)=>{
        let sCookies = req.headers.cookie,
            oCookies = {},
            checkResult = null;
        if(sCookies){
            let aPair = [];

            sCookies.split(';').forEach(cookie=>{
                aPair = cookie.split('=').map(val=>val.trim());

                checkResult = checkCookie(aPair[0], aPair[1]);

                if(checkResult!==false){
                    oCookies[aPair[0]] = checkResult;
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
