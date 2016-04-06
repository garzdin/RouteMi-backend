var User = require('../models/user.js');

module.exports = function(request, response, next) {
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  User.findOne({ apiKey: token }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else if(user) {
      user.lastActive = Date.now();
      user.save(function(error) {
        if(error) {
          return response.send({
            success: false,
            message: error
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
