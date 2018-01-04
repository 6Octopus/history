// there is still a problem with this setup
// but it probably can be ignored
// requests are ordered, but their times are all random for one day
// which I guess is fine, but in practice everything will be accessing the most recent
// still I guess this is okay

const fs = require('fs');
const generator = require('./requests-generator.js');

console.log('\x1b[0m' + 'start');

var users = [];
for (var i = 0; i < 5000; i++) {
  users.push({userID: generator.userGenerator()})
};

var stream = fs.createWriteStream("./gen-files/requests-dec-30.json", {'flags': 'a', 'encoding': null, 'mode': 0666});
stream.once('open', (fd) => {
  var minVideoCount = 600000;
  var finishedCounter = 0;

  users.forEach(user => {
    user.currentView = generator.viewStart(user.userID);
    user.finishedFlag = false;
    stream.write(JSON.stringify(user.currentView) + '\n');
  });

  while(finishedCounter < minVideoCount) {
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (!user.finishedFlag) {
        user.currentView = generator.viewCompleter(user.currentView);
        stream.write(JSON.stringify(user.currentView) + '\n');
        if (Math.floor(Math.random() * 10) === 7 || user.currentView.progress == user.currentView.totalLength) {
          if (minVideoCount === finishedCounter){
            user.finishedFlag = true;
          } else {
            user.currentView = generator.viewStart(user.userID);
          }
          finishedCounter += 1;
        }
      }
    }
    if (finishedCounter % 10000) {
      console.log(finishedCounter);
    }
  }
  // Important to close the stream when you're ready
  stream.end();
  console.log('done');
});
