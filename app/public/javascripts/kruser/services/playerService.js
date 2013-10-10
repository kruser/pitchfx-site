goog.provide('kruser.services.playerService');

goog.require('kruser.pojos.Player');
goog.require('kruser.pojos.PlayerInfo');

/**
 * An AngularJS service with functions to interact with player centric web
 * services
 */
kruser.services.playerService = [ '$http', '$q', '$log', function($http, $q, $log) {
    "use strict";

    /**
     * Get player info including things like, name, height, weight, etc.
     * 
     * @param {string}
     *            playerId
     * @returns {Promise<kruser.pojo.PlayerInfo>} the playerInfo data
     */
    this.getPlayerInfo = function(playerId) {
        return $http.get('/api/player_info/' + playerId).then(function(response) {
            return new kruser.pojos.PlayerInfo(response.data);
        });
    }

    /**
     * Web service function to retrieve all players. Normally this would be a
     * paging search but our data set is small enough to load into memory and
     * handle it from there.
     * 
     * @param {string}
     *            searchText - the text to search
     * @returns {Promise<kruser.pojos.Player>} a promise, when fufilled
     *          contains an array of data objects representing players
     */
    this.searchPlayers = function(searchText) {
        var params = {
            search : searchText,
            size : 10
        };
        return $http.get('/api/players', {
            params : params
        }).then(function(result) {
            var players = [];
            if (result.data && result.data.length > 0) {
                for ( var i = 0; i < result.data.length; i++) {
                    var player = new kruser.pojos.Player(result.data[i]);
                    players.push(player);
                }
            }
            return players;
        });
    };

} ];