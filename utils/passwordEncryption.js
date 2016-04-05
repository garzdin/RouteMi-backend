var bcrypt = require('bcrypt-nodejs');

exports.cryptPassword = function(password, callback) {
    bcrypt.hash(password, 10, null, function(error, hash) {
      if(error) {
        return callback(error);
      }
      return callback(error, hash);
    });
};

exports.comparePassword = function(password, userPassword, callback) {
   bcrypt.compare(password, userPassword, function(error, isPasswordMatch) {
      if(error) {
        return callback(error);
      }
      return callback(null, isPasswordMatch);
   });
};
