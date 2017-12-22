const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const eSearch=require('elasticsearch');
// https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
var client = new eSearch.Client( {
  hosts: 'localhost:9200',
  // log: 'trace'
});
var esTransportOpts = {
  level: 'silly',
  client: client
};
if (process.env.NODE_ENV !== 'production') {
  winston.add(winston.transports.File, { filename: './winston/systemLogs.log' });
}
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level: 'silly'});
winston.add(winston.transports.Elasticsearch, esTransportOpts)
winston.exitOnError = false;

winston.info('Hello world');
winston.debug('Debugging info');

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
