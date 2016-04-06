var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  dateRegistered: {
    type: Date,
    default: Date.now(),
    required: true
  },
  lastKnownLocation: {
    longitude: Number,
    latitude: Number
  },
  lastActive: {
    type: Date,
    default: Date.now()
  },
  apiKey: {
    type: String
  },
  isActive: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
