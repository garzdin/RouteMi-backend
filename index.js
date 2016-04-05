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
var authenticationModule = require('./routes/authentication.js');
var tokenMiddleware = require('./middleware/token.js');
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

app.get('/', function(request, response) {
  return response.send({ response: "Welcome to the API." })
});

app.post('/account/create', function(request, response) {
  if(!request.body.username || !request.body.password || !request.body.email) {
    return response.send({
      success: false,
      message: "Provide a username, a password and an email."
    });
  } else {
    passwordEncryption.cryptPassword(request.body.password, function(error, hashedPassword) {
      if(error) {
        return response.send({
          success: false,
          message: error
        });
      } else if(hashedPassword) {
        new User({
          username: request.body.username,
          password: hashedPassword,
          email: request.body.email,
          dateRegistered: Date.now(),
          lastActive: Date.now(),
          isActive: true
        }).save(function(error) {
          if(error) {
            return response.send({
              success: false,
              message: error
            });
          } else {
            return response.send({
              success: true,
              message: "User created successfully."
            });
          }
        });
      } else {
        return response.send({
          success: false,
          message: "Invalid password."
        });
      }
    });
  }
});

app.post('/authenticate', authenticationModule);

app.use(tokenMiddleware);

app.post('/account/login', function(request, response) {
  if(!request.body.username, !request.body.password) {
    return response.send({
      success: false,
      message: "Provide a username and a password."
    });
  }
  User.findOne({ username: request.body.username }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(user) {
      passwordEncryption.comparePassword(request.body.password, user.password, function(error, isValid) {
        if(error) {
          return response.send({
            success: false,
            message: "Password validation error."
          });
        } else if(isValid) {
          return response.send({
            success: true,
            message: "Logged in successfully."
          });
        } else {
          return response.send({
            success: false,
            message: "Wrong password."
          });
        }
      });
    } else {
      return response.send({
        success: false,
        message: "User not found."
      });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('RouteMiAPI app is running on port', app.get('port'));
});
