const moment = require('moment');

var date = moment();    //new moment obj represents current time
console.log(date.format('MMM Do, YYYY')); //format takes pattern we want our date
console.log(date.format('h:mm a'));

