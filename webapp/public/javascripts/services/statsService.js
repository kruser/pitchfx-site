var services = services || {};

/**
 * An AngularJS service with stat aggregator functions and web service calls
 * into the stats API
 */
services.statsService = [ '$log', '$http', function($log, $http) {
    "use strict";

    this.statCounter = 0;
    this.stats = {};

    /**
     * Get stats from the backend
     * 
     * @param {int}
     *            playerId - the player ID
     * @param {string}
     *            type - one of (batter|pitcher)
     * @param {*}
     *            filter - the filter object
     */
    this.getStats = function(playerId, type, filter) {
        var self = this;
        var params = {
            filter : filter,
        };
        return $http.get('/api/stats/' + playerId + '/' + type, {
            params : params
        }).then(function(result) {
            self.stats = result.data;
            self.statCounter++;
            return result.data;
        });
    };
} ];