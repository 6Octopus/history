const axios = require('axios');

axios.post('http://localhost:3000/viewed', {
  'first': 'carlos',
  'last': 'danger'
})
.then(res => {
  console.log('Success: ' + res.status)
})
.catch(err => {
  console.log(err)
});
