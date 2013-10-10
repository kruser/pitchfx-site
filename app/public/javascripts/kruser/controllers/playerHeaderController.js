goog.provide('kruser.controllers.playerHeaderController');

/**
 * A controller that manages searching players
 */
kruser.controllers.playerHeaderController = [ '$scope', '$log', '$routeParams', 'playerService', function($scope, $log, $routeParams, playerService) {
    $scope.playerId = $routeParams.playerId;
} ];