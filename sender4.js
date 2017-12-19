const axios = require('axios');

// for (var i = 0; i < 10; i++) {
//   setTimeout(() => {
//     axios.post('http://localhost:3000/viewed', fakeSession())
//     .then(res => {
//       // console.log(res.status + ' - Accepted');
//     })
//     .catch(err => {
//       console.log(err);
//       console.log('\nAs you can see, there was an error');
//     });
//   }, i * 1);
// }


// objectID: 5a385cab5fffa5fe5a125c5e

var viewData = {
  userID: "ixe0e6v9vkk8p60lozi8z09j",
  videoID: "jamesIsGreat",
  "instanceID":"mattbelesiu",
  "isAutoplay":true,
  "progress":"PT10S",
  "totalLength":"PT32S",
  "viewTime":"2017-12-15 00:10:25.000"
};

axios.post('http://localhost:3000/viewed', viewData)
.then(res => {
  console.log(res.status + ' - Accepted');
})
.catch(err => {
  console.log(err);
  console.log('\nAs you can see, there was an error');
});
