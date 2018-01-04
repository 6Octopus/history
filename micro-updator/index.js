const aws = require('aws-sdk');
const dbHelper = require('./mongoVCAlpha.js');
const queueUrl = process.env.videoServiceQueue;
const winston = require('./winston/winston.js');

// Scan DB for sessions that haven't been updated for 1hr to 1hr 1 min
// This insures that only newly 'stale' session info is sent out

aws.config.update({
  region: 'us-west-1'
});
var sqs = new aws.SQS();

console.log(typeof queueUrl);
console.log(queueUrl);

console.log('Micro Updator Starting...');
dbHelper.startConnection(() => {
  console.log('Micro Updator Status: ' + '\x1b[32m' + 'Ready' + '\x1b[0m');
  // dbHelper.staleScan();
  setInterval(() => {
    dbHelper.staleScan((results) => {
      if (results.length > 0) {
        var params = {
          MessageBody: JSON.stringify({data: results, method: 'PUT', route: '/videos/views'}),
          QueueUrl: queueUrl,
          DelaySeconds: 0
        };
        sqs.sendMessage(params, function(err, data) {
          if (err) {
            winston.warn({
              aux: 'view update',
              videosUpdated: results.length
            });
            console.log(err);
          } else {
            winston.info({
              aux: 'view update',
              anyUpdates: true,
              videosUpdated: results.length
            });
            console.log('Views sent to Video service')
          }
        });
      } else {
        winston.info({
          aux: 'view update',
          anyUpdates: false,
          videosUpdated: 0
        });
        console.log('No views to send')
      }
    });
  }, 60000);
});
