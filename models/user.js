var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  dateRegistered: Date,
  lastKnownLocation: {
    longitude: Number,
    latitude: Number
  },
  lastActive: Date,
  apiKey: String,
  isActive: Boolean
});

module.exports = mongoose.model('User', userSchema);
