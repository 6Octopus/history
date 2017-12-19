const axios = require('axios');
const fakeSession = require('./generator1.js');

for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    axios.post('http://localhost:3000/viewed', fakeSession())
    .then(res => {
      // console.log(res.status + ' - Accepted');
    })
    .catch(err => {
      console.log(err);
      console.log('\nAs you can see, there was an error');
    });
  }, i * 1);
}
