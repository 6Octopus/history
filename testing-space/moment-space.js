var moment = require('moment');
moment().format();

var progress = "P0D";
var totalLength = "PT32S";

console.log(moment.duration(progress) > moment.duration(totalLength));
