'use strict';

angular.module('pitchfxApp').service('Player', [ '$http', function($http) {
    /**
     * Get player info including things like, name, height, weight, etc.
     * 
     * @param {string}
     *            playerId
     * @returns {Promise<pojo.PlayerInfo>} the playerInfo data
     */
    this.getPlayerInfo = function(playerId) {
        return $http.get('/api/player_info/' + playerId).then(function(response) {
            return new pojos.PlayerInfo(response.data);
        });
    };

    /**
     * Web service function to retrieve all players. Normally this would be a
     * paging search but our data set is small enough to load into memory and
     * handle it from there.
     * 
     * @param {string}
     *            searchText - the text to search
     * @returns {Promise<pojos.Player>} a promise, when fufilled contains an
     *          array of data objects representing players
     */
    this.searchPlayers = function(searchText) {
        var params = {
            search : searchText,
            size : 10
        };
        return $http.get('/api/players', {
            params : params
        }).then(function(result) {
            var players;
            players = [];
            if (result.data && result.data.length > 0) {
                for (var i = 0; i < result.data.length; i++) {
                    var player = new pojos.Player(result.data[i]);
                    players.push(player);
                }
            }
            return players;
        });
    };

    /**
     * Get at bats for a batter
     * 
     * @param {int}
     *            playerId - the player id of the batter
     * @param {Date}
     *            from
     * @param {Date}
     *            to
     */
    this.getAtBatsForBatter = function(playerId, from, to) {
        var params = {
            batter : playerId,
            from : from,
            to : to,
        };
        return $http.get('/api/atbats', {
            params : params
        }).then(function(result) {
            return result.data;
        });
    };

    /**
     * Get at-bats for a pitcher
     * 
     * @param {int}
     *            playerId - the player id of the batter
     * @param {Date}
     *            from
     * @param {Date}
     *            to
     */
    this.getAtBatsForPitcher = function(playerId, from, to) {
        var params = {
            pitcher : playerId,
            from : from,
            to : to,
        };
        return $http.get('/api/atbats', {
            params : params
        }).then(function(result) {
            return result.data;
        });
    };

} ]);
