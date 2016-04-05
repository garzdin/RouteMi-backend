var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
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

app.set('tokenKey', process.env.TOKENKEY || 'Q353oF8Dp4NX51XJwdG7sIaI43l4JXyeRDClR0TYR5aPKBcUleRkyyprgQBR79U');

app.get('/', function(request, response) {
  response.send({ response: "Welcome to the API." })
});

app.get('/authenticate', function(request, response) {
  var token = jwt.sign('RouteMiApiJWT', app.get('tokenKey'));
  response.send({ token: token });
});

app.use(function(request, response, next) {
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('tokenKey'), function(error, decoded) {
      if (error) {
        return response.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

app.post('/kitten', function(request, response) {
  if(request.body.name) {
    var fluffy = new Kitten({ name: request.body.name });
    fluffy.save(function(error, fluffy) {
      if(error) return response.send({ error: error });
      response.send({ response: "Kitten saved successfully" });
    });
  } else {
    response.send({ error: "You didn't supply a name" });
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
