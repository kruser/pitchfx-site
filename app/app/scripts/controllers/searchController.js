var controllers = controllers || {};

/**
 * A controller that manages searching players
 */
controllers.searchController = [ '$scope', '$log', '$window', 'playerService', function($scope, $log, $window, playerService) {

    $scope.playersLoading = false;
    
    /* match theme.css */
    $scope.backgroundIndex = 'panorama-' + Math.floor((Math.random() * 4) + 1);

    /**
     * Search for players
     */
    $scope.searchPlayers = function(text) {
        $scope.playersLoading = true;
        return playerService.searchPlayers(text).then(function(players) {
            $scope.playersLoading = false;
            return players;
        });
    };

    /**
     * redirect to the player's page
     */
    $scope.playerSelected = function() {
        if ($scope.playerSelection && $scope.playerSelection.id) {
            var player = $scope.playerSelection;
            var url = '/player/' + player.id + '/' + player.getUrlFriendlyName();
            $window.location.href = url;
        }
    };

} ];