var Promise = require("bluebird");
const assert = require('assert'); // delete this
require('./mongoBeta.js')

const simpler = function() {
  var collection = db.collection('simpler');
  collection.insertOne({
    userID: 'bret'
  });
  console.log('bret for fuck sake')
}

module.exports.simpler = simpler;

// view: { userID, instanceID, videoID, isAutoplay, progress, totalLength }
// const simpleSession = function(view) {
//   return new Promise(function(resolve) {
//     const collection = db.collection('simpleViews');
//     collection.insertOne({
//       userID: userID,
//       sessionUpdateTimestamp: new Date,
//       views: [{
//         instanceID: view.instanceID,
//         videoID: view.videoID,
//         isAutoplay: view.isAutoplay,
//         playbackPosition: view.progress,
//         totalLength: view.totalLength
//       }]
//     })
//   })
// }












// for garbage bin
// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }
//
// insertDocuments(db, function() {
//   client.close();
// });
