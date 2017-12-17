var fs = require('fs');
const generator = require('./generator2.js');

var stream = fs.createWriteStream("./gen-files/ten-mil-v2.json", {'flags': 'a', 'encoding': null, 'mode': 0666});
console.log('\x1b[0m' + 'start');
stream.once('open', (fd) => {
  // 5 mil total
  // for 100,000 users
    // for 50 sessions per users
  for (var i = 0; i < 100000; i++) {
    var userID = generator.userGenerator();
    for (var j = 0; j < 50; j++) {
      stream.write(generator.sessionGenerator(userID) + '\n');
    }
    if (i % 10000 === 0) {
      console.log(i);
    }
  }
  // Important to close the stream when you're ready
  stream.end();
  console.log('done');
});
