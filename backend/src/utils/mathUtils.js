const calcPercent = (before, after) =>{

    if(before === 0)
        return 100;

    let percent = ((before-after) * 100)/(before);
        
    return parseFloat(percent.toFixed(1));
}

module.exports = {
    calcPercent
}