var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
try {
  var config = require('./config.json');
} catch (error) {
  var config;
}
var passwordEncryption = require('./utils/passwordEncryption.js');
var User = require('./models/user.js');

mongoose.connect(process.env.MONGOLAB_URL || config.mongolab_url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoLab.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.set('tokenKey', process.env.TOKENKEY || config.jwt_sign_key);

app.get('/', function(request, response) {
  response.send({ response: "Welcome to the API." })
});

app.post('/authenticate', function(request, response) {
  User.findOne({ username: request.body.username }, function(error, user) {
    if(error) {
      response.send({
        success: false,
        message: "User not found"
      });
    } else {
      passwordEncryption.comparePassword(request.body.password, user.password, function(error, isValid) {
        if(isValid) {
          var token = jwt.sign(user, app.get('tokenKey'));
          user.apiKey = token;
          response.send({
            success: true,
            token: token
          });
        } else {
          response.send({
            success: false,
            message: "Wrong password"
          });
        }
      });
    }
  });
});

app.use(function(request, response, next) {
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('tokenKey'), function(error, decoded) {
      if (error) {
        return response.send({ success: false, message: 'Failed to authenticate token.' });
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

app.listen(app.get('port'), function() {
  console.log('RouteMiAPI app is running on port', app.get('port'));
});
