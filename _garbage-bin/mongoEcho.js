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

  console.log('userID:', view.userID);

  var newView = {
    instanceID: view.instanceID,
    videoID: view.videoID,
    isAutoplay: view.isAutoplay,
    progress: view.progress,
    totalLength: view.totalLength
  }

  // collection.findOneAndUpdate({userID: view.userID}, {$set: {userID: 'troy "butt soup" barnes'}, $addToSet: {views: newView}}, {sort: {"sessionUpdateTimestamp": -1}, returnNewDocument:true } , ((err, doc) => {
  //   if (err) {
  //     console.log('ERR:', err);
  //   }
  //   console.log(doc);
  // }));
  //

  collection.find({userID: view.userID}, {sort: {"sessionUpdateTimestamp": -1}}).toArray((err, docs) => {
    if (err) {
      console.log('ERR:', err);
    }


    var viewInProgress = false;

    for (var i = 0; i < docs[0].views.length; i++) {
      console.log(docs[0].views[i].instanceID + ' - ' + newView.instanceID);
      // if (docs[0].views[i].instanceID === newView.instanceID) {
      //   console.log('instance found')
      // }
      // if (docs[0].views[i].instanceID === newView.instanceID && moment.duration(newView.progress) >= moment.duration(docs[0].views.progress)) {
      //   console.log('Video in progress, updating recorded progress point');
      //   docs[0].views[i].progress = newView.progress;
      //   viewInProgress = true;
      //   break;
      // }

      if (docs[0].views[i].instanceID === newView.instanceID && docs[0].views[i].videoID === newView.videoID && moment.duration(newView.progress) >= moment.duration(docs[0].views.progress)) {
        viewInProgress = true;
        console.log('Video in progress, updating recorded progress point');
        docs[0].views[i].progress = newView.progress;
        docs[0].sessionUpdateTimestamp = new Date(view.viewTime);
        collection.findOneAndUpdate({_id: ObjectId(docs[0]._id)}, {$set: {sessionUpdateTimestamp: new Date(view.viewTime), }}, function(err, doc) {
          if (err) {
            console.log('ERR:', err);
          } else {
            console.log(doc);
            console.log('Updated doc, updated view in doc')
          }
        });
        break;
      }
    }

    console.log('DOC ID:', docs[0]._id);

    if (false) {
      docs[0].sessionUpdateTimestamp = new Date(view.viewTime);
      collection.findOneAndUpdate({_id: ObjectId('5a385cab5fffa5fe5a125c5e')}, {$set: {sessionUpdateTimestamp: new Date(view.viewTime)}}, function(err, doc) {
        if (err) {
          console.log('ERR:', err);
        } else {
          console.log(doc);
          console.log('Updated doc, updated view in doc')
        }
      });
    }

    if(!viewInProgress) {
      collection.findOneAndUpdate({_id: ObjectId('5a385cab5fffa5fe5a125c5e')}, {$addToSet: {views: newView}, $set: {sessionUpdateTimestamp: new Date(view.viewTime)}}, {sort: {"sessionUpdateTimestamp": -1}, returnNewDocument : true}, function(err, doc) {
        if (err) {
          console.log('ERR:', err);
        } else {
          console.log(doc);
          console.log('Updated doc, added view to doc')
        }
      });
    }
  });
}

module.exports.db = db;
module.exports.simpleSession = simpleSession;
module.exports.incomingView = incomingView;
