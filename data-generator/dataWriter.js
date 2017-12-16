var fs = require('fs');
const sessionGenerator = require('./generator1.js');

var stream = fs.createWriteStream("alpha.json", {'flags': 'a', 'encoding': null, 'mode': 0666});
console.log('\x1b[0m' + 'start');
stream.once('open', (fd) => {
    for (var i = 0; i < 1000; i++) {
      stream.write(sessionGenerator() + '\n');
      if (i % 100000 === 0) {
        console.log(i);
      }
    }
    // Important to close the stream when you're ready
    stream.end();
    console.log('done');
});

// var x = new Date;
// console.log(Date.parse(x));
