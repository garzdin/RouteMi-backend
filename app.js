var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var tokenMiddleware = require('./middleware/token.js');
var loggingMiddleware = require('./middleware/activity.js')
var authenticationModule = require('./routes/authentication.js');
var accountModule = require('./routes/accounts.js');

mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://apiuser:4pv-aeh-PbH-Btw@ds013300.mlab.com:13300/routemiapi');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoLab.');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  return response.send({ response: "Welcome to the API." })
});

app.post('/account/create', accountModule.create);
app.post('/authenticate', authenticationModule);
app.use(tokenMiddleware);
app.use(loggingMiddleware);
app.post('/account/login', accountModule.login);
app.get('/account', function(request, response) {
  User.findOne({ apiKey: request.body.token || request.query.token || request.headers['x-access-token'] }, function(error, user) {
    if(error) {
      return response.send({
        success: false,
        message: error
      });
    } else {
      return response.send({
        success: true,
        user: user
      });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('RouteMiAPI app is running on port', app.get('port'));
});
