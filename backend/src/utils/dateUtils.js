const getWeekRange = () =>{
    let curr = new Date; // get current date
    let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstday = new Date(curr.setDate(first));
    let lastday = new Date(curr.setDate(last));

    return {
        firstday,
        lastday
    }
}

module.exports = {
    getWeekRange
}