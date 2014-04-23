'use strict';

angular.module('pitchfxApp').directive('playerButton', ['$window',
    function($window)
    {
        return {
            templateUrl: '/partials/playerButton.html',
            restrict: 'E',
            replace: true,
            scope:
            {
                'player': '=',
            },
            link: function linkFunction($scope)
            {
                /**
                 * redirect to the player's page
                 */
                $scope.openPlayer = function()
                {
                    var url, player = $scope.player;
                    if (player && player.id)
                    {
                        url = '/player/' + player.id + '/' + player.getUrlFriendlyName();
                        $window.location.assign(url);
                    }
                };

            }
        };
    }
]);
