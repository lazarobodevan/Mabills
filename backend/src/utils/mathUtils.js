const calcPercent = (before, after) =>{

    if(after === 0)
        return after;
    if(before === 0)
        return before;

    let percent = ((after-before) * 100)/(before);
        
    return parseFloat(percent.toFixed(1));
}

module.exports = {
    calcPercent
}