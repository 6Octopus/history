console.log('SQS Sender is initiating...');
const express = require('express')
const expressStatsd = require('express-statsd');

const app = express()
const bodyParser = require('body-parser');
const aws = require('aws-sdk');

app.use(expressStatsd({ host: 'statsd', port: 8125}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json()); // honestly I don't think I'll ever use this
console.log(app.get('env'));


///////////////////////////////////////
// SQS Initiator

// Load your AWS credentials and try to instantiate the object.
// aws.config.loadFromPath('./aws-config.json');

if (app.get('env') === 'production' || process.env.AWS_ACCESS_KEY_ID !== undefined) {
  aws.config.update({region: 'us-west-2'});
} else {
  aws.config.loadFromPath('./aws-config.json');
}

// Instantiate SQS.
var sqs = new aws.SQS();

// var queueUrl = "https://sqs.us-west-2.amazonaws.com/737489816178/historyQueue"; // aws
// var queueUrl = "http://0.0.0.0:9494/test-queue"; // docker
var queueUrl = "http://localhost:4568/history-queue"; // local

// Creating a queue.
app.get('/createSQS', function (req, res) {
    var params = {
        QueueName: "historyQueue"
    };

    sqs.createQueue(params, function(err, data) {
        if(err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

// END SQS
///////////////////////////////////////

app.get('/', (req, res) => {
  console.log('Someone is knocking on the sender.js door')
  res.send('You\'ve reached the sender, please leave a message after the tone');
});

app.post('/view-to-a-queue', (req, res) => {
  console.log(req.body);

  var params = {
    MessageBody: JSON.stringify(req.body),
    QueueUrl: queueUrl,
    DelaySeconds: 0
  };

  sqs.sendMessage(params, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
})

app.get('/purge-queue', function(req, res) {
  var params = {
    QueueUrl: queueUrl
  };

  sqs.purgeQueue(params, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`Sender is ready and listening on port ${port}!`))

module.exports = app;
