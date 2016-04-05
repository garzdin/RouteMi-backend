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

app.post('/register', function(request, response) {
  if(!request.body.username || !request.body.password || !request.body.email) {
    response.send({
      success: false,
      message: "Provide a username, a password and an email."
    });
  } else {
    passwordEncryption.cryptPassword(request.body.password, function(error, hashedPassword) {
      if(error) {
        response.send({
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
            response.send({
              success: false,
              message: error
            });
          } else {
            response.send({
              success: true,
              message: "User created successfully."
            });
          }
        });
      } else {
        response.send({
          success: false,
          message: "Invalid password."
        });
      }
    });
  }
});

app.post('/authenticate', function(request, response) {
  if(!request.body.username || !request.body.password) {
    response.send({
      success: false,
      message: "Provide a username and a password."
    });
  }
  User.findOne({ username: request.body.username }, function(error, user) {
    if(error) {
      response.send({
        success: false,
        message: error
      });
    } else if(user) {
      passwordEncryption.comparePassword(request.body.password, user.password, function(error, isValid) {
        if(isValid) {
          if(user.apiKey) {
            response.send({
              success: true,
              token: user.apiKey
            });
          } else {
            var token = jwt.sign(user, app.get('tokenKey'));
            user.apiKey = token;
            user.save(function(error) {
              if(error) {
                response.send({
                  success: false,
                  token: error
                });
              }
            });
            response.send({
              success: true,
              token: token
            });
          }
        } else {
          response.send({
            success: false,
            message: "Wrong password."
          });
        }
      });
      }
    } else {
      response.send({
        success: false,
        message: "User not found."
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
