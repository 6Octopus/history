const enableSuccessConsoleLogs = false;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const winston = require('./winston/winston.js');
const moment = require('moment');
moment().format();

// Connection URL
// const url = 'mongodb://localhost:27017'; // for local env
const url = 'mongodb://database'; // for docker env

// Database Name
const dbName = 'history';
var db;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to database");
  db = client.db(dbName);
});

// {"userID":"a90xvayfhzwftdeyvh_uuds_",
// "videoID":"6cgubpteh1e",
// "instanceID":"uot_q",
// "isAutoplay":true,
// "progress":"P0D",
// "totalLength":"PT32S",
// "viewTime":"2017-12-15T20:05:23.000Z"}
const incomingView = function(view) {
  // console.log(view);

  const collection = db.collection('userSessions');

  var newView = {
    instanceID: view.instanceID,
    videoID: view.videoID,
    isAutoplay: view.isAutoplay,
    progress: view.progress,
    totalLength: view.totalLength
  }


  var anHourAgo = moment(view.viewTime).subtract(1, 'h').toDate();

  collection.findOne({userID: view.userID, sessionUpdateTimestamp: {$gt: anHourAgo}}, (err, lastSession) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(lastSession);

      if (lastSession !== null) {
        var viewInProgress = false;

        for (var i = 0; i < lastSession.views.length; i++) {
          if (lastSession.views[i].instanceID === newView.instanceID && lastSession.views[i].videoID === newView.videoID && moment.duration(newView.progress) >= moment.duration(lastSession.views.progress)) {
            viewInProgress = true;
            // console.log('Video in progress, updating recorded progress point');
            lastSession.views[i].progress = newView.progress;
            lastSession.sessionUpdateTimestamp = new Date(view.viewTime);
            collection.findOneAndUpdate({_id: ObjectId(lastSession._id)},
              {$set: {sessionUpdateTimestamp: new Date(view.viewTime), 'views.$[t].progress': newView.progress}},
              {arrayFilters: [{ 't.instanceID': newView.instanceID }], sort: {"sessionUpdateTimestamp": -1}},
              function(err, doc) {
                if (err) {
                  console.log(err);
                  winston.warn({
                    type: 1,
                    userID: view.userID,
                    videoID: newView.videoID,
                    isAutoplay: newView.isAutoplay,
                    progress: newView.progress,
                    totalLength: newView.totalLength,
                    occurenceTime: new Date(view.viewTime),
                    realView: (moment.duration(newView.progress).asSeconds() / moment.duration(newView.totalLength).asSeconds()) >= .8
                  });
                } else {
                  // console.log(doc);
                  winston.info({
                    type: 1,
                    userID: view.userID,
                    videoID: newView.videoID,
                    isAutoplay: newView.isAutoplay,
                    progress: newView.progress,
                    totalLength: newView.totalLength,
                    occurenceTime: new Date(view.viewTime),
                    realView: (moment.duration(newView.progress).asSeconds() / moment.duration(newView.totalLength).asSeconds()) >= .8
                  });
                  if (enableSuccessConsoleLogs) {
                    console.log(`${view.instanceID}: 1 - Updated doc, updated view in array`)
                  }
                }
              });
            break;
          }
        }

        if(!viewInProgress) {
          // console.log('Active session, adding to it');
          collection.findOneAndUpdate({_id: ObjectId(lastSession._id)}, {$addToSet: {views: newView}, $set: {sessionUpdateTimestamp: new Date(view.viewTime)}}, {sort: {"sessionUpdateTimestamp": -1}, returnNewDocument : true}, function(err, doc) {
            if (err) {
              console.log(err);
              winston.warn({
                type: 2,
                userID: view.userID,
                videoID: newView.videoID,
                isAutoplay: newView.isAutoplay,
                progress: newView.progress,
                totalLength: newView.totalLength,
                occurenceTime: new Date(view.viewTime),
                realView: (moment.duration(newView.progress).asSeconds() / moment.duration(newView.totalLength).asSeconds()) >= .8
              });
            } else {
              // console.log(doc);
              winston.info({
                type: 2,
                userID: view.userID,
                videoID: newView.videoID,
                isAutoplay: newView.isAutoplay,
                progress: newView.progress,
                totalLength: newView.totalLength,
                occurenceTime: new Date(view.viewTime),
                realView: (moment.duration(newView.progress).asSeconds() / moment.duration(newView.totalLength).asSeconds()) >= .8
              });
              if (enableSuccessConsoleLogs) {
                console.log(`${view.instanceID}: 2 - Updated doc, added view to array`)
              }
            }
          });
        }
      } else {
        // there is no active session for the user, make a new one
        // console.log('No active session for user');
        collection.insertOne({
          userID: view.userID,
          sessionUpdateTimestamp: new Date(view.viewTime),
          views: [newView]
        }, (err, doc) => {
          if (err) {
            console.log(err);
            winston.warn({
              type: 3,
              userID: view.userID,
              videoID: newView.videoID,
              isAutoplay: newView.isAutoplay,
              progress: newView.progress,
              totalLength: newView.totalLength,
              occurenceTime: new Date(view.viewTime),
              realView: (moment.duration(newView.progress).asSeconds() / moment.duration(newView.totalLength).asSeconds()) >= .8
            });
          } else {
            // console.log(doc);
            winston.info({
              type: 3,
              userID: view.userID,
              videoID: newView.videoID,
              isAutoplay: newView.isAutoplay,
              progress: newView.progress,
              totalLength: newView.totalLength,
              occurenceTime: new Date(view.viewTime),
              realView: (moment.duration(newView.progress).asSeconds() / moment.duration(newView.totalLength).asSeconds()) >= .8
            });
            if (enableSuccessConsoleLogs) {
              console.log(`${view.instanceID}: 3 - New document/session created`);
            }
          }
        });
      }


    }
  });

}

module.exports.db = db;
module.exports.incomingView = incomingView;
