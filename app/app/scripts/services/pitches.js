'use strict';

angular.module('pitchfxApp').service('Pitches', ['$log', '$http',
    function($log, $http) {

        /**
         * Get pitches from the backend
         *
         * @param {int}
         *            playerId - the player ID
         * @param {*}
         *            atbatFilter - the atbat filter object
         */
        this.getPitches = function(playerId, atbatFilter) {
            var params = {
                atbatFilter: atbatFilter,
            };
            return $http.get('/api/pitches/' + playerId, {
                params: params
            }).then(function(result) {
                return result.data;
            });
        };
    }
]);
