const DateGenerator = require('random-date-generator');
const moment = require('moment');
moment().format();

var startDate = new Date(2017, 8, 1);
var endDate = new Date(2017, 11, 15);
var x = DateGenerator.getRandomDateInRange(startDate, endDate);
var y = x.toISOString();

const possible = 'abcdefghijklmnopqrstuvwxyz0123456789_';

var viewGenerator = () => {
  var progressSeconds;
  var totalSeconds;

  var viewInstance = {};

  viewInstance.videoID = '';
  for (var i = 0; i < 11; i++) {
    viewInstance.videoID += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  viewInstance.instanceID = '';
  for (var i = 0; i < 5; i++) {
    viewInstance.instanceID += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  viewInstance.isAutoplay = Boolean(Math.floor(Math.random() * 2));

  totalSeconds = 0;

  if (Math.floor(Math.random() * 5) === 4) {
    totalSeconds = Math.floor(Math.random() * 10800)
  } else {
    totalSeconds = Math.floor(Math.random() * 240);
    if (totalSeconds === 0) {
      totalSeconds = 42; // towel it
    }
  }

  progressSeconds = Math.floor(Math.random() * totalSeconds);
  viewInstance.progress = moment.duration(progressSeconds, 's').toISOString();
  viewInstance.totalLength = moment.duration(totalSeconds, 's').toISOString();

  return viewInstance;
}

var sessionGenerator = (userID) => {
  var session = {};
  session.userID = userID;
  session.views = [];

  var startDate = new Date(2017, 8, 1);
  var endDate = new Date(2017, 11, 15);
  session.sessionUpdateTimestamp = {$date: DateGenerator.getRandomDateInRange(startDate, endDate).toISOString()}; // random date in range

  var numberOfViews = Math.floor(Math.random() * 8) + 1;
  for (var i = 0; i < numberOfViews; i++) {
    session.views.push(viewGenerator());
  }

  return JSON.stringify(session);
}

var sessionGeneratorNow = (userID) => {
  var session = {};
  session.userID = userID;
  session.views = [];
  session.sessionUpdateTimestamp = {$date: (new Date).toISOString()};
  var numberOfViews = Math.floor(Math.random() * 8) + 1;
  for (var i = 0; i < numberOfViews; i++) {
    session.views.push(viewGenerator());
  }

  return JSON.stringify(session);
}

var userGenerator = () => {
  var userID = '';
  for (var i = 0; i < 24; i++) {
    userID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return userID;
}

module.exports.sessionGenerator = sessionGenerator;
module.exports.sessionGeneratorNow = sessionGenerator;
module.exports.userGenerator = userGenerator;
