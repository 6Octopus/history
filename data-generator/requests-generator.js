const DateGenerator = require('random-date-generator');
const moment = require('moment');
moment().format();

const possible = 'abcdefghijklmnopqrstuvwxyz0123456789_';

var flrRand = (input) => {
  return Math.floor(Math.random() * input);
}

var viewStart = (userID) => {
  var progressSeconds;
  var totalSeconds;

  var viewInstance = {};
  viewInstance.userID = userID;

  viewInstance.videoID = '';
  for (var i = 0; i < 11; i++) {
    viewInstance.videoID += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  viewInstance.instanceID = '';
  for (var i = 0; i < 5; i++) {
    viewInstance.instanceID += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  if (flrRand(100) < 40) {
    viewInstance.isAutoplay = false;
  } else {
    viewInstance.isAutoplay = true;
  }

  totalSeconds = 0;

  if (Math.floor(Math.random() * 5) === 4) {
    totalSeconds = Math.floor(Math.random() * 10800)
  } else {
    totalSeconds = Math.floor(Math.random() * 240);
    if (totalSeconds === 0) {
      totalSeconds = 42; // towel it
    }
  }
  progressSeconds = 0;
  viewInstance.progress = moment.duration(progressSeconds, 's').toISOString();
  viewInstance.totalLength = moment.duration(totalSeconds, 's').toISOString();

  viewInstance.viewTime = new Date(2017, 11, 16, flrRand(24), flrRand(60), flrRand(60));

  return viewInstance;
}

var viewCompleter = (view = viewStart()) => {
  var totalSeconds = moment.duration(view.totalLength).as('seconds');
  var progressSeconds = moment.duration(view.progress).as('seconds');

  progressSeconds += 15;

  if (progressSeconds >= totalSeconds) {
    view.viewTime = moment(view.viewTime).add(totalSeconds - (progressSeconds - 15), 's').toDate();
    progressSeconds = totalSeconds;
  } else {
    view.viewTime = moment(view.viewTime).add(15, 's').toDate();
  }
  view.progress = moment.duration(progressSeconds, 's').toISOString();

  return view;
}

var userGenerator = () => {
  var userID = '';
  for (var i = 0; i < 24; i++) {
    userID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return userID;
}

module.exports.userGenerator = userGenerator;
module.exports.viewStart = viewStart;
module.exports.viewCompleter = viewCompleter;
