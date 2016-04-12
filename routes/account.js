var passwordEncryption = require('../utils/passwordEncryption');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

module.exports = function(request, response) {
  User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else {
      return response.send({
        success: true,
        account: {
          id: user._id,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
          dateRegistered: user.dateRegistered,
          lastActive: user.lastActive,
          apiKey: user.apiKey,
        }
      });
    }
  });
};

module.exports.create = function(request, response) {
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
};

module.exports.reset = function(request, response) {
  if(!request.body.email) {
    return response.send({
      success: false,
      message: "Provide an email."
    });
  } else {
    var generatedToken = jwt.sign(request.body.email, process.env.TOKENKEY || 'Q353oF8Dp4NX51XJwdG7sIaI43l4JXyeRDClR0TYR5aPKBcUleRkyyprgQBR79U');
    User.findOne({ email: request.body.email }, function(error, user) {
      if(error) {
        return response.send({
          success: false,
          message: error
        });
      } else {
        user.resetToken = generatedToken;
        return response.send({
          success: true,
          token: generatedToken
        });
      }
    });
  }
};
