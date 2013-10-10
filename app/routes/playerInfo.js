var request = require('request');
var http = require('http');

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
    request('http://mlb.mlb.com/lookup/json/named.player_info.bam?sport_code=%27mlb%27&player_id=' + req.params.id, function(error, response, data) {
        if (response.statusCode === 200) {
            var json = JSON.parse(data);
            if (json.player_info && json.player_info.queryResults) {
                res.json(json.player_info.queryResults.row);
            } else {
                res.end();
            }
        } else {
            res.writeHead(response.statusCode);
            res.end()
        }
    })
};
