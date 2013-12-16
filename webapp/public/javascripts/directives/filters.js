var directives = directives || {};

/**
 * The directive to show all 
 */
directives.filters = [ 'playerService', '$log', function(playerService, $log) {
    "use strict";

    return {
        restrict : 'E',
        replace : true,
        scope : {
            'playerId' : '@',
            'playerPosition' : '@'
        },
        templateUrl : '/partials/filters.html',
        controller : controllers.filtersController,
    };
} ];