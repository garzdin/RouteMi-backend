var passwordEncryption = require('../utils/passwordEncryption');
var User = require('../models/user');

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
        if(error) {
          return response.send({
            success: false,
            message: "Password validation error."
          });
        } else if(isValid) {
          if(user.apiKey) {
            return response.send({
              success: true,
              token: user.apiKey
            });
          } else {
            var token = jwt.sign(user, process.env.TOKENKEY || 'Q353oF8Dp4NX51XJwdG7sIaI43l4JXyeRDClR0TYR5aPKBcUleRkyyprgQBR79U');
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
              message: "Authenticated successfully.",
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
