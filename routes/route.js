var User = require('../models/user');
var Route = require('../models/route');

module.exports = function(request, response) {
  User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(user) {
      Route.find({ owner: user._id }, function(error, routes) {
        if(error) {
          return response.send({
            success: false,
            message: "User not found."
          });
        } else if(routes) {
          return response.send({
            success: true,
            routes: routes
          });
        } else {
          return response.send({
            success: false,
            message: "No routes found."
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

module.exports.create = function(request, response) {
  if(!request.body.name || !request.body.description || !request.body.type) {
    return response.send({
      success: false,
      message: "Please provide a name, a description and a type."
    });
  }
  User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(user) {
      new Route({
        name: request.body.name,
        description: request.body.description,
        type: request.body.type,
        owner: user._id
      }).save(function(error) {
        if(error) {
          return response.send({
            success: false,
            message: error
          });
        } else {
          return response.send({
            success: true,
            message: "Route created successfully."
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

module.exports.update = function(request, response) {
  if(!request.body.name || !request.body.description) {
    return response.send({
      success: false,
      message: "Please provide a name and a description."
    });
  } else {
    Route.findOne({ _id: request.params.id }, function(error, route) {
      if(error) {
        return response.send({
          success: false,
          message: error
        });
      } else if(route) {
        User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
          if(error) {
            return response.send({
              success: false,
              message: error
            });
          } else if(user) {
            if(route.owner == user._id) {
              Route.findByIdAndUpdate(route.id, {
                name: request.body.name,
                description: request.body.description
              }, function(error, route) {
                if(error) {
                  return response.send({
                    success: false,
                    message: error
                  });
                } else if(route) {
                  return response.send({
                    success: true,
                    message: "Route successfully updated."
                  });
                } else {
                  return response.send({
                    success: false,
                    message: "Route not found."
                  });
                }
              });
            } else {
              return response.send({
                success: false,
                message: "You don't have permissions to update this route."
              });
            }
          } else {
            return response.send({
              success: false,
              message: "User not found."
            });
          }
        });
      } else {
        return response.send({
          success: false,
          message: "Route not found."
        });
      }
    });
  }
};

module.exports.delete = function(request, response) {
  Route.findOne({ _id: request.params.id }, function(error, route) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(route) {
      User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
        if(error) {
          return response.send({
            success: false,
            message: error
          });
        } else if(user) {
          if(route.owner == user._id) {
            Route.findByIdAndRemove(route.id, function(error, route) {
              if(error) {
                return response.send({
                  success: false,
                  message: error
                });
              } else if(route) {
                return response.send({
                  success: true,
                  message: "Route successfully deleted."
                });
              } else {
                return response.send({
                  success: false,
                  message: "Route not found."
                });
              }
            });
          } else {
            return response.send({
              success: false,
              message: "You don't have permissions to delete this route."
            });
          }
        } else {
          return response.send({
            success: false,
            message: "User not found."
          });
        }
      });
    } else {
      return response.send({
        success: false,
        message: "Route not found."
      });
    }
  });
};
