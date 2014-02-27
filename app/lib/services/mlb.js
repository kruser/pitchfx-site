var request = require('request');
var PlayerInfo = require('../pojos/mlb/PlayerInfo').PlayerInfo;

/**
 * Get player_info from MLBAM by ID. populated
 *
 * @param {string}
 *            playerId - the MLBAM id of the player
 * @param {function(playerInfo)}
 *            callback - the callback function playerId - the MLBAM id of the
 *            player
 */
exports.getPlayerInfo = function(playerId, callback) {
    request('http://mlb.mlb.com/lookup/json/named.player_info.bam?sport_code=%27mlb%27&player_id=' + playerId, function(error, response, data) {
        if (response.statusCode === 200) {
            var json = JSON.parse(data);
            if (json.player_info && json.player_info.queryResults) {
                callback(new PlayerInfo(json.player_info.queryResults.row));
                return;
            }
        }
        callback(undefined);
        return;
    });
};
