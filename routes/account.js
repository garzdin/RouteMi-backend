var passwordEncryption = require('../utils/passwordEncryption.js');
var User = require('../models/user.js');

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
        user: user
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
