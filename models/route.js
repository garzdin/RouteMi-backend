var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var poi = require('poi');

var routeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['Walking', 'Biking', 'Driving'],
    required: true
  },
  pois: {
    type: Array,
    children: [poi]
  },
  owner: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    required: true
  }
  dateUpdated: {
    type: Date
  }
});

module.exports = mongoose.model('Route', routeSchema);
