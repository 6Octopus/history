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

var viewData = {
  userID: "1mwrf2qf28uy6ozmpjwokmfaX",
  videoID: "6cgubpteh18",
  "instanceID":"uot_q",
  "isAutoplay":true,
  "progress":"P0D",
  "totalLength":"PT32S",
  "viewTime":"2017-12-14 23:59:59.737"
};

axios.post('http://localhost:3000/viewed', viewData)
.then(res => {
  console.log(res.status + ' - Accepted');
})
.catch(err => {
  console.log(err);
  console.log('\nAs you can see, there was an error');
});
