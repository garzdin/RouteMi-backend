var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
try {
  var config = require('./config.json');
} catch (error) {
  var config;
}
var User = require('./models/user.js');
var passwordEncryption = require('./utils/passwordEncryption.js');
var tokenMiddleware = require('./middleware/token.js');
var authenticationModule = require('./routes/authentication.js');
var accountModule = require('./routes/accounts.js');

mongoose.connect(process.env.MONGOLAB_URL || config.mongolab_url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoLab.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || config.local_port));

app.get('/', function(request, response) {
  return response.send({ response: "Welcome to the API." })
});

app.post('/account/create', accountModule.create);
app.post('/authenticate', authenticationModule);
app.use(tokenMiddleware);
app.post('/account/login', accountModule.login);

app.listen(app.get('port'), function() {
  console.log('RouteMiAPI app is running on port', app.get('port'));
});
