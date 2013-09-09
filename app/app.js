/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var atbats = require('./routes/atbats');

var app = express();
app.get('/api/atbats', atbats.findAll);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
