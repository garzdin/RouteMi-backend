var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var poiSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  route: {
    type: String,
    required: true
  }
},
{
  timestamps: {}
});

module.exports = mongoose.model('POI', poiSchema);
