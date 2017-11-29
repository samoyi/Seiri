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

module.exports = {
    findAsciiIndexes,
};
