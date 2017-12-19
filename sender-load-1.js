const axios = require('axios');
const fs = require('fs');

var requestArray = fs.readFileSync('./data-generator/gen-files/requests-dec-17.json', 'utf8').split('\n');
var successCount = 0;
var errorCount = 0;

var numberOfSeconds = 2;
var reqPerSec = 500;

var finishedOutput = () => {
  if (successCount + errorCount >=  numberOfSeconds * reqPerSec) {
    console.log((successCount + errorCount) + '/' + numberOfSeconds * reqPerSec + ' requests sent\n');
    console.log(successCount + ' - Successes')
    console.log(errorCount + ' - Errors')
  }
};

var sendRequest = function(viewData) {
  axios.post('http://localhost:3000/viewed', viewData)
  .then(res => {
    // console.log(res.status + ' - Accepted');
    successCount += 1;
    finishedOutput();
  })
  .catch(err => {
    errorCount += 1;
    // console.log(err);
    // console.log('\nAs you can see, there was an error');
    finishedOutput();
  });
};

for (var i = 0; i < numberOfSeconds; i++) {
  setTimeout(() => {
    var currSec = i;
    console.log((successCount + errorCount) + '/' + numberOfSeconds * reqPerSec + ' requests sent');
    for (var j = 0; j < reqPerSec; j++) {
      sendRequest(requestArray[i * 10 + j]);
    }
  }, 1000*i);
}
