var passwordEncryption = require('../utils/passwordEncryption.js');
var User = require('../models/user.js');

module.exports = function(request, response) {
  if(!request.body.username || !request.body.password) {
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
        if(isValid) {
          if(user.apiKey) {
            return response.send({
              success: true,
              token: user.apiKey
            });
          } else {
            var token = jwt.sign(user, app.get('tokenKey'));
            user.apiKey = token;
            user.save(function(error) {
              if(error) {
                return response.send({
                  success: false,
                  token: error
                });
              }
            });
            return response.send({
              success: true,
              token: token
            });
          }
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
