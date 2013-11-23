var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.battingStatsController = [ '$scope', '$log', 'playerService', 'statsService', function($scope, $log, playerService, statsService) {

    /**
     * Setup the controller
     */
    function init() {
        $scope.loading = true;
        $scope.atbats = [];
        $scope.battingAverage = 0.0;
        $scope.wOBA = 0.0;

        statsService.resetStats();
        playerService.getAtBatsForBatter($scope.playerId).then(function(atbats) {
            $scope.atbats = atbats;
            for ( var i = 0; i < $scope.atbats.length; i++) {
                statsService.accumulateAtBat($scope.atbats[i]);
            }
            $scope.battingAverage = statsService.BA;
            $scope.wOBA = statsService.wOBA;
            $scope.loading = false;
        });
    }

    init();
} ];