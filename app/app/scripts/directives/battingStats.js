'use strict';

angular.module('pitchfxApp').directive('battingStats', ['Player', 'Filters',
    function(playerService, filtersService)
    {
        return {
            restrict: 'E',
            replace: true,
            scope:
            {
                'playerId': '@',
                'playerPosition': '@'
            },
            templateUrl: '/partials/battingStats.html',
            link: function(scope)
            {
                scope.tabs = [
                {
                    route: 'atbats',
                    label: 'At Bats',
                    active: false
                },
                {
                    route: 'pitches',
                    label: 'Pitches',
                    active: false
                },
                {
                    route: 'scouting',
                    label: 'Scout Assist',
                    active: false
                },
                {
                    route: 'twitter',
                    label: 'Twitter',
                    active: false
                }, ];
                scope.filtersService = filtersService;

                scope.$on('$routeChangeSuccess', function(event, toState)
                {
                    if (toState && toState.$$route)
                    {
                        var route = toState.$$route.meta,
                            int = 0,
                            tab = null;
                        for (int = 0; int < scope.tabs.length; int++)
                        {
                            tab = scope.tabs[int];
                            tab.active = (tab.route === route);
                        }
                        _gaq.push(['_trackEvent', 'tabs', route, scope.playerId]);
                    }
                });
            }
        };
    }
]);
