const moment = require('moment');

const getWeekRange = () =>{
    let curr = new Date; // get current date
    let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstday = moment.utc(curr.setDate(first)).set({hour:0,minute:0,second:0,millisecond:0}).toDate();
    let lastday = moment.utc(curr.setDate(last)).set({hour:0,minute:0,second:0,millisecond:0}).toDate();

    return {
        firstday,
        lastday
    }
}

module.exports = {
    getWeekRange
}