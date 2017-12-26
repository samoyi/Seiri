'use strict';

function findAsciiIndexes(str){
    let aStr = [...str],
        aIndex = [];
    aStr.filter((char,index)=>{
        if(char.codePointAt(0)<127){
            aIndex.push(index);
        }
    });
    return aIndex;
}

function longPress(oNode, callback, nMS=800){
    oNode.addEventListener('touchstart', ()=>{
        oNode.LPtimer = setTimeout(()=>{
            callback();
        }, nMS);
    });
    oNode.addEventListener('touchend', ()=>{
        clearInterval(oNode.LPtimer);
    });
}

module.exports = {
    findAsciiIndexes, longPress,
};
