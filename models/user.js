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
  lastKnownLocation: {
    longitude: Number,
    latitude: Number
  },
  apiKey: {
    type: String
  },
  isActive: {
    type: Boolean,
    required: true
  },
  lastActive: {
    type: Date,
    default: Date.now()
  },
  resetToken: {
    type: String,
    default: null
  }
},
{
  timestamps: {}
});

module.exports = mongoose.model('User', userSchema);
