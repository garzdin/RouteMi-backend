var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://apiuser:4pv-aeh-PbH-Btw@ds013300.mlab.com:13300/routemiapi');
var Kitten = require('./models/kitten.js');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoLab.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send({response: "Welcome to the API."})
});

app.post('/kitten', function(request, response) {
  if(request.body.name) {
    var fluffy = new Kitten({ name: request.body.name });
    fluffy.save(function(error, fluffy) {
      if(error) return response.send({ error: error });
      response.send("Kitten saved successfully");
    });
  } else {
    response.send("You didn't supply a name");
  }
});

app.get('/kittens', function(request, response) {
  Kitten.find({}, function(error, kittens) {
    var kittensMap = {};

    kittens.forEach(function(kitten) {
      kittensMap[kitten._id] = kitten;
    });

    response.send({ kittens: kittensMap });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
