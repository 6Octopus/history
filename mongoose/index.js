const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost/thesisAlpha';

mongoose.Promise = global.Promise;
const db = mongoose.connect(dbURI, {
  useMongoClient: true,
});

module.exports = db;
