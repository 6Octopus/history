var moment = require('moment');
moment().format();

// var user = {
//   views: [
//     {videoID, fifteenSecThing, totalLength, lastTimeStamp}
//   ]
// }

// helper function to sort views by lastTimeStamp
// needs to return all sessions between now and last time it ran
// this happens every 60 seconds
var getSessions = () => {
  var sessionTime = date.now();
  if (((sessionTime - users.views.lastTimeStamp) > 3600) && ((sessionTime - users.views.lastTimeStamp) < 3660)) {
    // the session is over
  } else {
    // the session is in progress
    // so do nothing
  }
}

var countView = (viewInstance) => {

  // if (viewInstance)
}

console.log(moment.isDuration('x'));
