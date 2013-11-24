var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.battingStatsController = [ '$scope', '$log', 'playerService', 'statsService', function($scope, $log, playerService, statsService) {

    $scope.atbats = [];
    $scope.battingAverage = 0.0;
    $scope.wOBA = 0.0;

    $scope.filters = {
        pitcherHand : '',
    };

    $scope.$watch('filters.pitcherHand', function(filters) {
        $scope.runStats();
    });

    /**
     * Setup the controller
     */
    function init() {
        $scope.loading = true;
        playerService.getAtBatsForBatter($scope.playerId).then(function(atbats) {
            $scope.atbats = atbats;
            $scope.runStats();
            $scope.loading = false;
        });
    }

    /**
     * Run the filters and stats against the atBats
     */
    $scope.runStats = function() {
        if ($scope.atbats.length > 0) {
            $log.debug('Running Stats');
            statsService.resetStats();
            for ( var i = 0; i < $scope.atbats.length; i++) {
                var atbat = $scope.atbats[i];
                if ($scope.passesFilter(atbat)) {
                    statsService.accumulateAtBat(atbat);
                }
            }

            statsService.completeStats();
            
            /* Percentage Stats */
            $scope.battingAverage = statsService.BA;
            $scope.wOBA = statsService.wOBA;
            $scope.obp = statsService.obp;
            $scope.slg = statsService.slg;
            $scope.babip = statsService.babip;
            $scope.rmi = statsService.rmi;

            /* Counting Stats */
            $scope.abs = statsService.atbats;
            $scope.plateAppearances = statsService.plateAppearances;
            $scope.singles = statsService.singles;
            $scope.doubles = statsService.doubles;
            $scope.triples = statsService.triples;
            $scope.homeRuns = statsService.homeRuns;
            $scope.strikeouts = statsService.strikeouts;
            $scope.walks = statsService.walks;
            $scope.iWalks = statsService.iWalks;
            $scope.hitByPitch = statsService.hitByPitch;
            $scope.sacrifices = statsService.sacBunts + statsService.sacFlies;
            $scope.rboe = statsService.rboe;
        }
    }

    /**
     * Checks to see if the atbat passes the filters
     * 
     * @param {*}
     *            atbat - the atbat to check against the scope's filter object
     * @returns {Boolean} true if the atbat passes the filters
     */
    $scope.passesFilter = function(atbat) {
        if ($scope.filters.pitcherHand && atbat.p_throws !== $scope.filters.pitcherHand) {
            return false;
        }
        return true;
    }

    init();
} ];