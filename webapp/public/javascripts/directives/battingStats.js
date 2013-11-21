var directives = directives || {};

/**
 * The directive to show all 
 */
directives.battingStats = [ 'playerService', '$log', function(playerService, $log) {
    "use strict";

    return {
        restrict : 'E',
        replace : true,
        scope : {
            'playerId' : '@',
        },
        templateUrl : '/partials/battingStats.html',
        controller : controllers.battingStatsController,
    };
} ];