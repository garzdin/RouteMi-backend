var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  owner: {
    type: String,
    required: true
  }
},
{
  timestamps: {}
});

module.exports = mongoose.model('Route', routeSchema);
