var jwt = require('jsonwebtoken');
try {
  var config = require('./config.json');
} catch (error) {
  var config;
}

module.exports = function(request, response, next) {
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.TOKENKEY || config.jwt_sign_key, function(error, decoded) {
      if (error) {
        return response.send({ success: false, message: 'Failed to authenticate token.' });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
};
