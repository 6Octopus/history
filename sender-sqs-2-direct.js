const aws = require('aws-sdk');

// Load your AWS credentials and try to instantiate the object.
// if (app.get('env') === 'production' || process.env.AWS_ACCESS_KEY_ID !== undefined) {
//
//   aws.config.update({
//     region: 'us-west-2',
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.secretAccessKey
//   });
// } else {
  aws.config.loadFromPath('./aws-config.json');
// }

// Instantiate SQS.
var sqs = new aws.SQS();

// var queueUrl = "https://sqs.us-west-2.amazonaws.com/737489816178/historyQueue"; // aws
// var queueUrl = "http://0.0.0.0:9494/test-queue"; // docker
var queueUrl = "http://localhost:4568/history-queue"; // local


const fs = require('fs');

var requestArray = fs.readFileSync('./data-generator/gen-files/requests-dec-17.json', 'utf8').split('\n');
var successCount = 0;
var errorCount = 0;

// please set these
var numberOfSeconds = process.argv[2] || 5;
var reqPerSec = process.argv[3] || 10;

var finishedOutput = () => {
  if (successCount + errorCount >=  numberOfSeconds * reqPerSec) {
    console.log((successCount + errorCount) + '/' + numberOfSeconds * reqPerSec + ' requests sent\n');
    console.log(successCount + ' - Successes')
    console.log(errorCount + ' - Errors')
  }
};

var viewQueue = [];

var sendViews = function(viewData) {
  successCount += 1;
  viewQueue.push(viewData);
  if (viewQueue.length >= 500) {
    var params = {
      MessageBody: JSON.stringify(viewQueue),
      QueueUrl: queueUrl,
      DelaySeconds: 0
    };
    viewQueue = [];
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        // console.log(data);
      }
    });
  }
  finishedOutput();
};

for (let i = 0; i < numberOfSeconds; i++) {
  setTimeout(() => {
    var currSec = i;
    console.log((successCount + errorCount) + '/' + numberOfSeconds * reqPerSec + ' requests sent');
    for (var j = 0; j < reqPerSec; j++) {
      sendViews(requestArray[i * reqPerSec + j]);
    }
  }, 1000*i);
}
