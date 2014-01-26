var directives = directives || {};

/**
 * The directive to show all
 */
directives.battingStats = [ 'playerService', '$log', '$route', function(playerService, $log, $route) {
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
            scope.playerType = (scope.playerPosition === '1') ? 'pitcher' : 'batter';
            scope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState && toState.$$route) {
                    scope.link = toState.$$route.meta;
                }
            });
        }
    };
} ];