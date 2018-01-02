const aws = require('aws-sdk');
const dbHelper = require('./mongoVCAlpha.js');
const queueUrl = require('./video-config.js').videoServiceQueue;
// const winston = require('./winston/view-winston.js'); // needs to be written

// Scan DB for sessions that haven't been updated for 1hr to 1hr 1 min
// This insures that only newly 'stale' session info is sent out

aws.config.update({
  region: 'us-west-1'
})
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
          MessageBody: JSON.stringify({data: results}),
          QueueUrl: queueUrl,
          DelaySeconds: 0
        };
        sqs.sendMessage(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            console.log('Views sent to Video service')
          }
        });
      } else {
        console.log('No views to send')
      }
    });
  }, 60000);
});
