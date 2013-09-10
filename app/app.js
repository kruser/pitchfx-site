/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var atbats = require('./routes/atbats');
var players = require('./routes/players');

var app = express();
app.use(express.compress());
app.use(express.staticCache());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/atbats', atbats.query);
app.get('/api/players', players.query);
app.get('/api/players/:id', players.getPlayer);

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
