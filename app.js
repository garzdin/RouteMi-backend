var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var token = require('./routes/middleware/token');
var logging = require('./routes/middleware/logging')
var authentication = require('./routes/authentication');
var account = require('./routes/account');
var route = require('./routes/route');

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

app.post('/account/create', account.create);
app.post('/authenticate', authentication);
app.use(token);
app.use(logging);
app.get('/account', account);
app.post('/route', route.create);

app.listen(app.get('port'), function() {
  console.log('RouteMiAPI app is running on port', app.get('port'));
});
