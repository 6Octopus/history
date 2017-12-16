const axios = require('axios');

axios.post('http://localhost:3000/viewed', {
  userID: 'UCRDXA8xNPF6K_Zxj5YYyfIg',
  instanceID: 'pn01',
  videoID: 'u2xGb6y3rBE',
  isAutoplay: true,
  progress: 'PT0S',
  totalLength: 'PT40S'
})
.then(res => {
  // console.log(res.status + ' - Accepted');
})
.catch(err => {
  console.log(err);
  console.log('\nAs you can see, there was an error');
});
