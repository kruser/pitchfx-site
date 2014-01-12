var services = services || {};

/**
 * An AngularJS service with stat aggregator functions and web service calls
 * into the stats API
 */
services.pitchesService = [ '$log', '$http', function($log, $http) {
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
    this.getPitches = function(playerId, type, filter) {
        var params = {
            filter : filter,
        };
        return $http.get('/api/pitches/' + playerId + '/' + type, {
            params : params
        }).then(function(result) {
            return result.data;
        });
    };
} ];