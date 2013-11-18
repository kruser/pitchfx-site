var directives = directives || {};

/**
 * The directive to show all 
 */
directives.pitchingStats = [ 'playerService', '$log', function(playerService, $log) {
    "use strict";

    return {
        restrict : 'E',
        replace : true,
        scope : {
            'playerId' : '=',
        },
        templateUrl : '/partials/pitchingStats.html'
    };
} ];