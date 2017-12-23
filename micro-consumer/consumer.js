const Consumer = require('sqs-consumer');
const aws = require('aws-sdk');
const dbHelper = require('./mongoGolf.js');
const winston = require('./winston/winston.js');

// const expressStatsd = require('express-statsd');
// this is throwing an error, because it is above app
// app.use(expressStatsd({ host: 'statsd', port: 8125}));

aws.config.loadFromPath('./aws-config.json');

// for fake sqs setup
// https://github.com/iain/fake_sqs
// https://github.com/feathj/docker-fake-sqs
// run 1: fake_sqs
// run 2: curl http://localhost:4568 -d "Action=CreateQueue&QueueName=history-queue&AWSAccessKeyId=access%20key%20id"

const app = Consumer.create({
  // queueUrl: 'https://sqs.us-west-2.amazonaws.com/737489816178/historyQueue', // aws
  // queueUrl: 'http://0.0.0.0:9494/test-queue', // docker
  queueUrl: 'http://localhost:4568/history-queue', // localhost
  handleMessage: (message, done) => {
    // console.log(JSON.parse(message.Body))
    // console.log(typeof JSON.parse(message.Body))
    var viewArray = JSON.parse(message.Body);
    for (var i = 0; i < viewArray.length; i++) {
      dbHelper.incomingView(viewArray[i]);
    }
    done();
  },
  sqs: new aws.SQS(),
  batchSize: 10
});

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {


  app.on('error', (err) => {
    // console.log(err.message);
  });

  app.start();
  console.log('SQS Consumer is running');
}


module.exports = app;
