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
     * @param {*} atbatFilter - the atbat filter object
     */
    this.getPitches = function(playerId, atbatFilter) {
        var params = {
            atbatFilter : atbatFilter,
        };
        return $http.get('/api/pitches/' + playerId, {
            params : params
        }).then(function(result) {
            return result.data;
        });
    };
} ];