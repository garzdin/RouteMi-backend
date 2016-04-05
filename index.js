var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://apiuser:4pv-aeh-PbH-Btw@ds013300.mlab.com:13300/routemiapi');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoLab.');
});

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send({response: "Welcome to the API."})
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
