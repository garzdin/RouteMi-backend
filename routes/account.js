var fs = require('fs');
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
    } else if(user) {
      return response.send({
        success: true,
        account: {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          lastKnownLocation: user.lastKnownLocation,
          isActive: user.isActive,
          dateRegistered: user.dateRegistered,
          lastActive: user.lastActive,
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

module.exports.create = function(request, response) {
  if(!request.body.username || !request.body.password || !request.body.email) {
    return response.send({
      success: false,
      message: "Provide a username, a password and an email."
    });
  } else {
    User.findOne({$or:[{ username: request.body.username }, { email: request.body.email }]}, function(error, user) {
      if(error) {
        return response.send({
          success: false,
          message: error
        });
      } else if(user) {
        if(user.username == request.body.username) {
          return response.send({
            success: false,
            message: "Username already exists."
          });
        } else if(user.email == request.body.email) {
          return response.send({
            success: false,
            message: "Email already exists."
          });
        } else {
          return response.send({
            success: false,
            message: "User already exists."
          });
        }
      } else {
        passwordEncryption.cryptPassword(request.body.password, function(error, hashedPassword) {
          if(error) {
            return response.send({
              success: false,
              message: error
            });
          } else if(hashedPassword) {
            fs.readFile(request.body.image, function(error, data) {
              if(error) {
                return response.send({
                  success: false,
                  message: error
                });
              } else if(data) {
                new User({
                  username: request.body.username,
                  password: hashedPassword,
                  email: request.body.email,
                  firstName: request.body.firstName,
                  lastName: request.body.firstName,
                  profileImage: data,
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
                  message: "Error parsing image."
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
      } else if(user) {
        user.resetToken = generatedToken;
        user.save(function(error) {
          if(error) {
            return response.send({
              success: false,
              message: error
            });
          } else {
            return response.send({
              success: true,
              message: "Reset token has been updated successfully."
            });
          }
        });
      } else {
        return response.send({
          success: false,
          token: "User not found."
        });
      }
    });
  }
};

module.exports.updateLocation = function(request, response) {
  if(!request.body.latitude || !request.body.longitude) {
    return response.send({
      success: false,
      message: "No coordinates recieved."
    });
  } else {
    User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
      if(error) {
        return response.send({
          success: false,
          message: error
        });
      } else if(user) {
        user.location.latitude = request.body.latitude;
        user.location.longitude = request.body.longitude;
        user.save(function(error) {
          if(error) {
            return response.send({
              success: false,
              message: error
            });
          } else {
            return response.send({
              success: true,
              message: "User's location has been updated successfully."
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
  }
};
