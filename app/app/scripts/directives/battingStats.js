var directives = directives || {};

/**
 * The directive to show all
 */
directives.battingStats = [ 'playerService', 'filtersService', '$log', '$route', function(playerService, filtersService, $log, $route) {
    "use strict";

    return {
        restrict : 'E',
        replace : true,
        scope : {
            'playerId' : '@',
            'playerPosition' : '@'
        },
        templateUrl : '/partials/battingStats.html',
        link : function(scope, element, attrs) {
            scope.tabs = [ {
                route: 'atbats',
                label : 'At Bats',
                active : false
            }, {
                route: 'pitches',
                label : 'Pitches',
                active : false
            }, {
                route: 'scouting',
                label : 'Scout Assist',
                active : false
            }, ];
            scope.filtersService = filtersService;
            scope.playerType = (scope.playerPosition === '1') ? 'pitcher' : 'batter';
            scope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState && toState.$$route) {
                    var route = toState.$$route.meta;
                    for ( var int = 0; int < scope.tabs.length; int++) {
                        var tab = scope.tabs[int];
                        tab.active = (tab.route === route);
                    }
                }
            });
        }
    };
} ];