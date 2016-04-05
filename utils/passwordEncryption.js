var bcrypt = require('bcrypt-nodejs');

exports.cryptPassword = function(password, callback) {
    bcrypt.hash(password, 10, null, function(error, hash) {
      return callback(error, hash);
    });
};

exports.comparePassword = function(password, userPassword, callback) {
   bcrypt.compare(password, userPassword, function(error, isPasswordMatch) {
      return callback(error, isPasswordMatch);
   });
};
