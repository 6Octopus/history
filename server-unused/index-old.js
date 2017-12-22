const express = require('express')
const expressStatsd = require('express-statsd');
const app = express()
const bodyParser = require('body-parser');
const dbHelper = require('../mongod/mongoGolf.js');
const aws = require('aws-sdk');

app.use(expressStatsd({ host: 'statsd', port: 8125}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json()); // honestly I don't think I'll ever use this



///////////////////////////////////////
//Start SQS

// Load your AWS credentials and try to instantiate the object.
aws.config.loadFromPath('./aws-config.json');

// Instantiate SQS.
var sqs = new aws.SQS();

var queueUrl = "https://sqs.us-west-2.amazonaws.com/737489816178/historyQueue";
var receipt  = "";

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
  console.log('Hey someone just hit us up!')
  res.send('Hello World!');
});

app.post('/viewed', (req, res) => {
  dbHelper.incomingView(req.body);
  res.sendStatus(202);
})

app.post('/simpleTest', (req, res) => {
  res.sendStatus(200);
})

// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`))
