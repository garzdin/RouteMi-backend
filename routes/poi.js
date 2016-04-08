var User = require('../models/user');
var Route = require('../models/route');
var Poi = require('../models/poi');

module.exports = function(request, response) {
  User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(user) {
      Route.findOne({ _id: request.params.route_id, owner: user._id }, function(error, route) {
        if(error) {
          return response.send({
            success: false,
            message: error
          });
        } else if(route) {
          Poi.find({ route: route._id }, function(error, pois) {
            if(error) {
              return response.send({
                success: false,
                message: "Pois not found."
              });
            } else {
              return response.send({
                success: true,
                pois: pois
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
    } else {
      return response.send({
        success: false,
        message: "User not found."
      });
    }
  });
};

module.exports.single = function(request, response) {
  User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(user) {
      Route.findOne({ _id: request.params.route_id, owner: user._id }, function(error, route) {
        if(error) {
          return response.send({
            success: false,
            message: error
          });
        } else if(route) {
          Poi.findOne({ _id: request.params.id, route: route._id }, function(error, poi) {
            if(error) {
              return response.send({
                success: false,
                message: error
              });
            } else if(poi) {
              return response.send({
                success: true,
                poi: poi
              });
            } else {
              return response.send({
                success: false,
                message: "Poi not found."
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
    } else {
      return response.send({
        success: false,
        message: "User not found."
      });
    }
  });
};

module.exports.create = function(request, response) {
  if(!request.body.title) {
    return response.send({
      success: false,
      message: "Please provide a title."
    });
  } else {
    Route.findOne({ _id: request.params.route_id }, function(error, route) {
      if(error) {
        return response.send({
          success: false,
          message: error
        });
      } else if(route) {
        new Poi({
          title: request.body.title,
          subtitle: request.body.subtitle,
          description: request.body.description,
          coordinates: {
            latitude: request.body.latitude,
            longitude: request.body.longitude
          },
          route: route._id
        }).save(function(error) {
          if(error) {
            return response.send({
              success: false,
              message: error
            });
          } else {
            return response.send({
              success: true,
              message: "Poi created successfully."
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

module.exports.update = function(request, response) {
  if(!request.body.title || !request.body.subtitle || !request.body.description || !request.body.latitude || !request.body.longitude ) {
    return response.send({
      success: false,
      message: "Please provide a name, a subtitle, a description, a longitude and a latitude."
    });
  } else {
    Route.findOne({ _id: request.params.route_id }, function(error, route) {
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
              Poi.findByIdAndUpdate(request.params.id, {
                title: request.body.title,
                subtitle: request.body.subtitle,
                description: request.body.description,
                coordinates: {
                  latitude: request.body.latitude,
                  longitude: request.body.longitude
                }
              }, function(error, poi) {
                if(error) {
                  return response.send({
                    success: false,
                    message: error
                  });
                } else if(poi) {
                  return response.send({
                    success: true,
                    message: "Poi successfully updated."
                  });
                } else {
                  return response.send({
                    success: false,
                    message: "Poi not found."
                  });
                }
              });
            } else {
              return response.send({
                success: false,
                message: "You don't have permissions to update this Poi."
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
  Route.findOne({ _id: request.params.route_id }, function(error, route) {
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
            Poi.findByIdAndRemove(request.params.id, function(error, poi) {
              if(error) {
                return response.send({
                  success: false,
                  message: error
                });
              } else if(poi) {
                return response.send({
                  success: true,
                  message: "Poi successfully deleted."
                });
              } else {
                return response.send({
                  success: false,
                  message: "Poi not found."
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
