const enableSuccessConsoleLogs = true;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
// const winston = require('./winston/view-winston.js'); // needs to be written
const moment = require('moment');
moment().format();

// Connection URL
const url = 'mongodb://localhost:27017'; // for local env
// const url = 'mongodb://database'; // for docker env

// Database Name
const dbName = 'history';
var db;

// Use connect method to connect to the server
var startConnection = function (callback) {
  MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to database");
    db = client.db(dbName);
    callback();
  });
}

// END SETUP

var staleScan = function() {
  console.log('Stale Scan between')
  console.log(moment().subtract(61, 'm').toString());
  console.log(moment().subtract(60, 'm').toString());

  // find every stale session using findAll where sessionUpdateTimestamp is an hour old
  // return them as an array I guess
  const collection = db.collection('userSessions');
  collection.find({sessionUpdateTimestamp:
    {
      // $lt: moment('2017-12-30 00:00:28.000').subtract(60, 'm').toDate(),
      $gte: moment('2017-12-30 00:00:28.000').subtract(61, 'm').toDate()
      // $gte: moment('2017-12-30 00:00:28.000').subtract(1, 'm').toDate()
    }
  }).toArray((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(docs);
      console.log('Docs length: ' + docs.length);
      console.log(viewFormatter(docs));
    }
  })
};

// I will need to flatten a multidimmensional array to a single depth array
var viewFormatter = function(sessionsArray) {
  var formattedViewCount = {}

  var realViews = [].concat(...sessionsArray.map(session => {
    return session.views.filter(view => {
      // return views where progress time is >= 80% of totalLength
      return (moment.duration(view.progress).asSeconds() / moment.duration(view.totalLength).asSeconds()) >= .8;
    });
  }));
  console.log('Real Views:', realViews.length);

  for (var i = 0; i < realViews.length; i++) {
    if (!formattedViewCount[realViews[i].videoID]) {
      formattedViewCount[realViews[i].videoID] = 1;
    } else {
      formattedViewCount[realViews[i].videoID] += 1;
    }
  };

  return formattedViewCount;
 };

module.exports.startConnection = startConnection;
module.exports.staleScan = staleScan;
module.exports.viewFormatter = viewFormatter;
