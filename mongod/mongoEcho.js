var Promise = require("bluebird");
const MongoClient = require('mongodb').MongoClient;
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

const incomingViewOld = function(view) {
  collection.findOne({"userID": view.userID, "$orderby":{ "_id": -1 }})
}

// view: { userID, instanceID, videoID, isAutoplay, progress, totalLength }
const simpleSession = function(view) {
  return new Promise(function(resolve) {
    const collection = db.collection('mongoEcho');
    collection.insertOne({
      userID: view.userID,
      sessionUpdateTimestamp: new Date,
      views: [{
        instanceID: view.instanceID,
        videoID: view.videoID,
        isAutoplay: view.isAutoplay,
        playbackPosition: view.progress,
        totalLength: view.totalLength
      }]
    })
  })
}

// {"userID":"a90xvayfhzwftdeyvh_uuds_",
// "videoID":"6cgubpteh1e",
// "instanceID":"uot_q",
// "isAutoplay":true,
// "progress":"P0D",
// "totalLength":"PT32S",
// "viewTime":"2017-12-15T20:05:23.000Z"}
const incomingView = function(view) {
  const collection = db.collection('userSessions');
  var anHourBefore = moment(view.viewTime).subtract(1, 'h').toDate();
  collection.findOne({"userID": view.userID}, ((err, doc) => {
    if (err) {
      console.log('ERR:', err);
    }
    console.log(doc);
  }));
}

module.exports.db = db;
module.exports.simpleSession = simpleSession;
module.exports.incomingView = incomingView;
