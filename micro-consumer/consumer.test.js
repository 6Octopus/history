const { expect } = require('chai');
const request = require('supertest');
const app = require('./consumer.js');
const should = require('chai').should();

console.log(app);

describe('Consumer', () => {
  it('should contain a queue url', function(done) {
    app.queueUrl.should.be.a('string');
  })
})
