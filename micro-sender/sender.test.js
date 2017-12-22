const { expect } = require('chai');
const request = require('supertest');
const app = require('./sender.js');

describe('Get request to /', () => {
  it('should respond with 200', function(done) {
    request(app)
      .get('/')
      .end((err, response) => {
        if (err) { console.log(err) };
        expect(response.res.text).to.equal('You\'ve reached the sender, please leave a message after the tone');
        done();
      })
  });
});

describe('Get request to /createSQS', () => {
  it('should respond with 200', function(done) {
    request(app)
      .get('/createSQS')
      .end((err, response) => {
        if (err) { console.log(err) };
        expect(typeof response.body).to.equal('object');
        expect(response.body.QueueUrl.substring(0, 36)).to.equal('https://sqs.us-west-2.amazonaws.com/');
        done();
      })
  });
});

describe('Get request to /view-to-a-queue', () => {
  it('should respond with 404', function(done) {
    request(app)
      .get('/view-to-a-queue')
      .end((err, response) => {
        if (err) { console.log(err) };
        // console.log('res:', response)
        expect(typeof 'is a wonderful james bond pun').to.equal('string');
        expect(response.status).to.equal(404);
        // expect(response.body.QueueUrl.substring(0, 36)).to.equal('https://sqs.us-west-2.amazonaws.com/');
        done();
      })
  });
});
