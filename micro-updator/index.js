const aws = require('aws-sdk');
const dbHelper = require('./mongoVCAlpha.js'); // needs to be written
// const winston = require('./winston/view-winston.js'); // needs to be written

// aws.config.loadFromPath('./aws-config.json'); // needs to be written

// Scan DB for sessions that haven't been updated for 1hr to 1hr 1 min
// This insures that only newly 'stale' session info is sent out

console.log('Micro Updator Starting...');
dbHelper.startConnection(() => {
  console.log('Micro Updator Status: ' + '\x1b[32m' + 'Ready' + '\x1b[0m');
  // dbHelper.staleScan();
  setInterval(dbHelper.staleScan, 60000);
});
