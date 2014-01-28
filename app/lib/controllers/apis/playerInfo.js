var request = require('request');
var mlb = require('../../services/mlb');

/**
 * Get player_info from MLBAM by ID. The req.params.id is expected to be
 * populated
 * 
 * @param req -
 *            the express request
 * @param res -
 *            the express response
 */
exports.getPlayer = function(req, res) {
    var playerId = req.params.playerId;
    mlb.getPlayerInfo(playerId, function(player) {
        if (player) {
            res.json(player);
        } else {
            var msg = 'Can not find player: ' + playerId;
            console.error(msg);
            res.send(404, msg);
        }
    });
};
