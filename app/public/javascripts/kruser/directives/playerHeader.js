goog.provide('kruser.directives.playerHeader');

goog.require('kruser.controllers.playerHeaderController');

/**
 * A fielding splits widget based on the POJO straight from a player json blob.
 */
kruser.directives.playerHeader = [ '$log', '$timeout', function($log, $timeout) {
    "use strict";

    return {
        restrict : 'E',
        replace : true,
        controller : kruser.controllers.playerHeaderController,
        templateUrl : 'partials/playerHeader.html',
    };
} ];
