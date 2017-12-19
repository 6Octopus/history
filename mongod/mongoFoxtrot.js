var Promise = require("bluebird");
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
moment().format();

// Connection URL
const url = 'mongodb://localhost:27017'; // for local env
// const url = 'mongodb://database'; // for docker env

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
  const collection = db.collection('userSessions');

  var newView = {
    instanceID: view.instanceID,
    videoID: view.videoID,
    isAutoplay: view.isAutoplay,
    progress: view.progress,
    totalLength: view.totalLength
  }

  collection.find({userID: view.userID}, {sort: {"sessionUpdateTimestamp": -1}}).toArray((err, docs) => {
    if (err) {
      console.log(err);
    }

    if (docs.length > 0 && moment(view.viewTime).subtract(1, 'h').isBefore(docs[0].sessionUpdateTimestamp)) {
      var lastSession = docs[0];
      var viewInProgress = false;

      for (var i = 0; i < lastSession.views.length; i++) {
        console.log(lastSession.views[i].instanceID + ' - ' + newView.instanceID);

        if (lastSession.views[i].instanceID === newView.instanceID && lastSession.views[i].videoID === newView.videoID && moment.duration(newView.progress) >= moment.duration(lastSession.views.progress)) {
          viewInProgress = true;
          console.log('Video in progress, updating recorded progress point');
          lastSession.views[i].progress = newView.progress;
          lastSession.sessionUpdateTimestamp = new Date(view.viewTime);
          collection.findOneAndUpdate({_id: ObjectId(lastSession._id)},
            {$set: {sessionUpdateTimestamp: new Date(view.viewTime), 'views.$[t].progress': newView.progress}},
            {arrayFilters: [{ 't.instanceID': newView.instanceID }], sort: {"sessionUpdateTimestamp": -1}},
            function(err, doc) {
              if (err) {
                console.log(err);
              } else {
                // console.log(doc);
                console.log('Updated doc, updated view in array')
              }
            });
          break;
        }
      }

      if(!viewInProgress) {
        console.log('Active session, adding to it');
        collection.findOneAndUpdate({_id: ObjectId(lastSession._id)}, {$addToSet: {views: newView}, $set: {sessionUpdateTimestamp: new Date(view.viewTime)}}, {sort: {"sessionUpdateTimestamp": -1}, returnNewDocument : true}, function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            // console.log(doc);
            console.log('Updated doc, added view to array')
          }
        });
      }
    } else {
      // there is no active session for the user, make a new one
      console.log('No active session for user');
      console.log('Make new document/session');
      collection.insertOne({
        userID: view.userID,
        sessionUpdateTimestamp: new Date(view.viewTime),
        views: [newView]
      });
    }
  });
}

module.exports.db = db;
module.exports.incomingView = incomingView;
