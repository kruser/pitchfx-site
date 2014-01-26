var services = services || {};

/**
 * An AngularJS service with stat aggregator functions and web service calls
 * into the stats API
 */
services.statsService = [ '$log', '$http', function($log, $http) {
    "use strict";

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
        var params = {
            filter : filter,
        };
        return $http.get('/api/stats/' + playerId + '/' + type, {
            params : params
        }).then(function(result) {
            return result.data;
        });
    };
} ];