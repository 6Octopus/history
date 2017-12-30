const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const eSearch = require('elasticsearch');
const elasticConfig = require('./elastic-config.json');
// https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
var client = new eSearch.Client({
  // hosts: 'localhost:9200', // local
  // hosts: 'https://elastic:0Mgpj9KHVC0x4rjup5oIpvHt@dab48f1859520e7d0e60365872eeb435.us-west-2.aws.found.io:9243', // cloud
  hosts: elasticConfig.elasticCloudURL, // cloud
});

var esTransportOpts = {
  level: 'silly',
  client: client
};
if (process.env.NODE_ENV !== 'production') {
  winston.add(winston.transports.File, { filename: './winston/systemLogsCloud.log' });
}
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
