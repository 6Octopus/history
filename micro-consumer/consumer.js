const Consumer = require('sqs-consumer');
const aws = require('aws-sdk');
const dbHelper = require('./mongoGolf.js');
const winston = require('./winston/winston.js');

// const expressStatsd = require('express-statsd');
// this is throwing an error, because it is above app
// app.use(expressStatsd({ host: 'statsd', port: 8125}));

aws.config.loadFromPath('./aws-config.json');
aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'us-west-1'
});

// Local Fake SQS
// https://github.com/iain/fake_sqs
// run 1: fake_sqs
// run 2: curl http://localhost:4568 -d "Action=CreateQueue&QueueName=history-queue&AWSAccessKeyId=access%20key%20id"


const app = Consumer.create({
  // queueUrl: 'http://localhost:4568/history-queue', // localhost
  // queueUrl: 'http://sqs/history-queue', // docker
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/737489816178/historyQueue', // aws
  handleMessage: (message, done) => {
    console.log(JSON.parse(message.Body))

    var viewArray = JSON.parse(message.Body);
    for (var i = 0; i < viewArray.length; i++) {
      // console.log(typeof JSON.parse(viewArray[i]));
      // console.log(JSON.parse(viewArray[i]));
      dbHelper.incomingView(JSON.parse(viewArray[i]));
    }
    done();
  },
  sqs: new aws.SQS(),
  batchSize: 10
});

app.on('error', (err) => {
  // console.log(err.message);
});

app.start();
console.log('SQS Consumer is running');


module.exports = app;
