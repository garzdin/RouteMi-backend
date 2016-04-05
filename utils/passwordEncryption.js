var bcrypt = require('bcrypt-nodejs');
var saltRound = 10;

exports.cryptPassword = function(password, callback) {
  bcrypt.genSalt(saltRound, function(error, salt) {
    if(error) {
      return callback(error, null);
    } else {
      bcrypt.hash(password, salt, null, function(error, hash) {
        if(error) {
          return callback(error, null);
        }
        return callback(null, hash);
      });
    }
  });
};

exports.comparePassword = function(password, userPassword, callback) {
  bcrypt.compare(password, userPassword, function(error, isPasswordMatch) {
    if(error) {
      return callback(error, null);
    }
    return callback(null, isPasswordMatch);
  });
};
