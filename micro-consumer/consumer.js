const Consumer = require('sqs-consumer');
const aws = require('aws-sdk');
const dbHelper = require('./mongoGolf.js');
const expressStatsd = require('express-statsd');

app.use(expressStatsd({ host: 'statsd', port: 8125}));

aws.config.loadFromPath('./aws-config.json');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/737489816178/historyQueue',
  handleMessage: (message, done) => {
    // console.log(JSON.parse(message.Body))
    // console.log(typeof JSON.parse(message.Body))

    dbHelper.incomingView(JSON.parse(message.Body));
    done();
  },
  sqs: new aws.SQS(),
  batchSize: 10
});

app.on('error', (err) => {
  console.log(err.message);
});

app.start();
console.log('SQS Consumer is running');
