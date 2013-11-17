/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

/* Routing Pages */
var routes = require('./routes');
var player = require('./routes/player');

/* API Requires */
var atbatsApi = require('./routes/apis/atbats');
var playersApi = require('./routes/apis/players');
var playerInfoApi = require('./routes/apis/playerInfo');

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
app.get('/api/atbats', atbatsApi.query);
app.get('/api/players', playersApi.query);
app.get('/api/players/:id', playersApi.getPlayer);
app.get('/api/player_info/:id', playerInfoApi.getPlayer);

// Page Templates
app.get('/', routes.index);
app.get('/player/:player', player.page);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
