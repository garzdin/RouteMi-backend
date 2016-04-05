var passwordEncryption = require('../utils/passwordEncryption.js');
var User = require('../models/user.js');

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

module.exports.login = function(request, response) {
  if(!request.body.username || !request.body.password) {
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
};
