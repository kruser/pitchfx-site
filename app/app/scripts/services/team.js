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
                var players = [];
                for (var player in result.data)
                {
                    var dataObj = {
                        id: result.data[player].id,
                        first: result.data[player].first,
                        last: result.data[player].last
                    };
                    players.push(new pitchfx.Player(dataObj));
                }
                console.log(players);
                return players;
            });
        };
    }
]);
