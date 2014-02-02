var path = require('path');
var mlb = require('../services/mlb');

/**
 * Loads all partials from the partials folder
 */
exports.partials = function(req, res) {
    var stripped = req.url.split('.')[0];
    var requestedView = path.join('./', stripped);
    res.render(requestedView, function(err, html) {
        if (err) {
            res.render('404');
        } else {
            res.send(html);
        }
    });
};

/**
 * Render the home page
 */
exports.index = function(req, res) {
    res.render('index');
};

/**
 * Renders the player pages
 */
exports.player = function(req, res) {
    var playerId = req.params.playerId;
    mlb.getPlayerInfo(playerId, function(player) {
        if (player) {
            res.render('player', {
                title : player.name_display_first_last,
                playerInfo : player
            });
        } else {
            var msg = 'Can not find player: ' + playerId;
            res.send(404, msg);
        }
    });
};