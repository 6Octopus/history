const mongoose = require('mongoose');
require('./index.js');

const UserSession = new mongoose.Schema({
    userID: String,
    sessionUpdateTimestamp: Date, // this is unnecessary probably
    views: [{
      instanceID: String,
      videoID: String,
      isAutoplay: Boolean,
      playbackPosition: String,
      totalLength: String,
      playbackUpdateTimestamp: Date
    }]
}, {timestamps: true);

const usDoc = mongoose.model('usDocModel', UserSession);



// view: { instanceID, videoID, userID, isAutoplay, progress, totalLength }
var incomingView = (view) => {
  console.log('VIEW\n' + view);
  var oneHourAgo = new Date;
  oneHourAgo.setHours(lastDate.getHours() - 1);

  usDoc.findOne({userID: userID, sessionUpdateTimestamp: {'$lt': oneHourAgo}}).then(doc => {
    console.log(doc);
  });
  // maybe use findAndModify https://docs.mongodb.com/v3.2/reference/method/db.collection.findAndModify/
}

var simpleDB = (view) => {
  console.log('VIEW\n' + view);

  usDoc.
}
