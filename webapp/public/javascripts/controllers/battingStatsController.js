var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.battingStatsController = [ '$scope', '$log', 'playerService', function($scope, $log, playerService) {


    function init() {
        $scope.loading = true;
        $scope.atbats = [];

        playerService.getAtBatsForBatter($scope.playerId).then(function(atbats) {
            $scope.atbats = atbats;
            $scope.loading = false;
        });
    }

    init();
} ];