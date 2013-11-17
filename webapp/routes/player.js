var mlb = require('../services/mlb');

/**
 * GET player page.
 */
exports.page = function(req, res) {
    var playerId = req.params.player[1];
    mlb.getPlayerInfo(playerId, function(player) {
        if (player) {
            res.render('player', {
                title : 'Justin Morneau',
                playerInfo : player
            });
        } else {
            var msg = 'Can not find player: ' + playerId;
            console.error(msg)
            res.send(404, msg);
        }
    });
};