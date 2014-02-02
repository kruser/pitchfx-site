var services = services || {};

/**
 * An AngularJS service to aid in retrieval of pitches based on a filter
 */
services.pitchesService = [ '$log', '$http', function($log, $http) {
    "use strict";

    /**
     * Get pitches from the backend
     * 
     * @param {int}
     *            playerId - the player ID
     * @param {string}
     *            type - one of (batter|pitcher)
     * @param {*} atbatFilter - the atbat filter object
     * @param {*} pitchFilter - the pitch filter object
     */
    this.getPitches = function(playerId, type, atbatFilter, pitchFilter) {
        var params = {
            filter : filter,
            pitchFilter : pitchFilter,
        };
        return $http.get('/api/pitches/' + playerId + '/' + type, {
            params : params
        }).then(function(result) {
            return result.data;
        });
    };
} ];