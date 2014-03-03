'use strict';

// Module dependencies.
var express = require('express'), path = require('path');

var app = express();

// Express Configuration
app.configure('development', function() {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(__dirname, '.tmp')));
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
    app.set('views', __dirname + '/app/views');
});

app.configure('production', function() {
    app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.compress());
    app.set('views', __dirname + '/views');
});

app.configure(function() {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Router needs to be last
    app.use(app.router);
});

// Controllers
var atbatsApi = require('./lib/controllers/apis/atbats');
var playersApi = require('./lib/controllers/apis/players');
var playerInfoApi = require('./lib/controllers/apis/playerInfo');
var statsApi = require('./lib/controllers/apis/stats');
var pitchesApi = require('./lib/controllers/apis/pitches');
var sitemap = require('./lib/controllers/sitemap');
var controllers = require('./lib/controllers');

// Server Routes
app.get('/api/atbats', atbatsApi.query);
app.get('/api/players', playersApi.query);
app.get('/api/players/:playerId', playersApi.getPlayer);
app.get('/api/player_info/:playerId', playerInfoApi.getPlayer);
app.get('/api/stats/:playerId', statsApi.query);
app.get('/api/pitches/:playerId', pitchesApi.query);
app.get('/player/:playerId/:playerName', controllers.player);

// Angular Routes
app.get('/partials/*', controllers.partials);
app.get('/sitemap.xml', sitemap.generate); 
app.get('/*', controllers.index);

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});