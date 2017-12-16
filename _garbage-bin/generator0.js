// var fs = require('fs');
var moment = require('moment');
moment().format();

const possible = 'abcdefghijklmnopqrstuvwxyz0123456789_';

var initDataGenerator = () => {
  var initObject = {};
  initObject.userID = '';
  initObject.videoID = '';
  initObject.isAutoplay = Boolean(Math.floor(Math.random() * 2));
  initObject._progressSeconds = 0;
  initObject._totalSeconds = 0;
  initObject.progress = moment.duration(0, 's').toISOString();
  initObject.totalLength;

  for (var i = 0; i < 24; i++) {
    initObject.userID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  for (var i = 0; i < 11; i++) {
    initObject.videoID += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  if (Math.floor(Math.random() * 5) === 4) {
    initObject._totalSeconds = Math.floor(Math.random() * 10800)
  } else {
    initObject._totalSeconds = Math.floor(Math.random() * 240);
    if (initObject._totalSeconds === 0) {
      initObject._totalSeconds = 42; // towel it
    }
  }

  initObject.totalLength = moment.duration(initObject._totalSeconds, 's').toISOString();

  // console.log(initObject);
  return initObject;
}

// initDataGenerator();

module.exports = initDataGenerator;
