var express = require('express');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');
var http = require('http');
var path = require('path');

app.set('port',process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine','jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(express.static(path.join(__dirname,'public')));
app.get('/',routes.index);
app.get('/partials/:name', routes.partials);

app.get('/api/name', api.name);

app.get('*',routes.index);

http.createServer(app).listen(app.get('port'),function() {
  console.log('Express server listening on port '+ app.get('port'));
})