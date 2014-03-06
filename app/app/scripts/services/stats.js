'use strict';

angular.module('pitchfxApp').service('Stats', ['$log', '$http',
    function($log, $http)
    {
        /**
         * Get stats from the backend
         *
         * @param {int}
         *            playerId - the player ID
         * @param {*}
         *            filter - the filter object
         */
        this.getStats = function(playerId, filter)
        {
            var params = {
                filter: filter,
            };
            return $http.get('/api/stats/' + playerId,
            {
                params: params
            }).then(function(result)
            {
                return result.data;
            });
        };
    }
]);
