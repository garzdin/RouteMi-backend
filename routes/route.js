var User = require('../models/user');
var Route = require('../models/route');

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
