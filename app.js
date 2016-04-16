var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var token = require('./routes/middleware/token');
var logging = require('./routes/middleware/logging')
var authentication = require('./routes/authentication');
var account = require('./routes/account');
var route = require('./routes/route');
var poi =  require('./routes/poi');

mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://apiuser:4pv-aeh-PbH-Btw@ds013300.mlab.com:13300/routemiapi');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/account/create', account.create);
app.post('/authenticate', authentication);
app.post('/account/reset', account.reset);
app.use(token);
app.use(logging);
app.get('/account', account);
app.put('/account/location', account.updateLocation);
app.get('/routes', route);
app.get('/route/:id', route.single);
app.post('/route/create', route.create);
app.put('/route/update/:id', route.update);
app.delete('/route/delete/:id', route.delete);
app.get('/route/:route_id/pois', poi);
app.get('/route/:route_id/poi/:id', poi.single);
app.post('/route/:route_id/poi/create', poi.create);
app.put('/route/:route_id/poi/update/:id', poi.update);
app.delete('/route/:route_id/poi/delete/:id', poi.delete);

app.listen(process.env.PORT || 5000);
