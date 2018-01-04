const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const eSearch = require('elasticsearch');
// https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
console.log('elasticCloudURL: ', process.env.elasticCloudURL);
var client = new eSearch.Client({
  hosts: process.env.elasticCloudURL // cloud
});

var esTransportOpts = {
  level: 'silly',
  client: client
};
// if (process.env.NODE_ENV !== 'production') {
//   winston.add(winston.transports.File, { filename: './winston/systemLogsCloud.log' });
// }
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level: 'warn'});
winston.add(winston.transports.Elasticsearch, esTransportOpts)
winston.exitOnError = false;

module.exports = winston;

/*
{
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}
*/
