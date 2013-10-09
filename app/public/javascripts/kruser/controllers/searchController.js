goog.provide('kruser.controllers.searchController');

/**
 * A controller that manages searching players
 */
kruser.controllers.searchController = [ '$scope', '$log', 'playerService', function($scope, $log, playerService) {

    $scope.battersLoading = false;
    $scope.pitchersLoading = false;

    $scope.searchBatters = function(text) {
        $scope.battersLoading = true;
        return playerService.searchPlayers(text).then(function(players) {
            $log.debug(players);
            $log.debug('hahhhh: ' + players.length);
            $scope.battersLoading = false;
            return players;
        });
    };

} ];