'use strict';

angular.module('pitchfxApp').service('Team', ['$http',
    function($http)
    {
        /**
         * Get roster given the team from the backend
         *
         * @param {object}
         *            roster - list of players on team's most recent roster
         */
        this.getRoster = function(team)
        {
            return $http.get('/api/roster?team=' + team.name).then(function(result)
            {
                return result.data;
            });
        };
    }
]);
