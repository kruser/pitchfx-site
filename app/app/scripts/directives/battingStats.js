var directives = directives || {};

/**
 * The directive to show all
 */
directives.battingStats = [ 'playerService', 'filtersService', '$log', '$route', '$routeParams', function(playerService, filtersService, $log, $route, $routeParams) {
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
            }, {
                route: 'twitter',
                label : 'Twitter',
                active : false
            }, ];
            scope.filtersService = filtersService;
            
            scope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState && toState.$$route) {
                    var route = toState.$$route.meta;
                    for ( var int = 0; int < scope.tabs.length; int++) {
                        var tab = scope.tabs[int];
                        tab.active = (tab.route === route);
                    }
                    _gaq.push(['_trackEvent', 'tabs', route, scope.playerId]);
                }
            });
        }
    };
} ];