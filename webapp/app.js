
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var atbats = require('./routes/apis/atbats');
var players = require('./routes/apis/players');
var playerInfo = require('./routes/apis/playerInfo');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.compress());
app.use(express.staticCache());
app.use(express.json());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// APIs
app.get('/api/atbats', atbats.query);
app.get('/api/players', players.query);
app.get('/api/players/:id', players.getPlayer);
app.get('/api/player_info/:id', playerInfo.getPlayer);

// Page Templates
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
