var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.battingStatsController = [ '$scope', '$log', 'playerService', 'statsService', function($scope, $log, playerService, statsService) {

    $scope.atbats = [];
    $scope.battingAverage = 0.0;
    $scope.wOBA = 0.0;
    $scope.loading = true;

    $scope.filters = {
        pitcherHand : '',
        date : {
            start : '2010-01-01',
            start_moment : moment('2010-01-01'),
            end : moment().format('YYYY-MM-DD'),
            end_moment : moment().add('days', 1),
        },
        runners : {
            gate : 'OR',
            empty : false,
            first : false,
            second : false,
            third : false,
        }
    };

    /**
     * Sets up all the watchers on filter variables
     */
    function setupWatchers() {
        $scope.$watch('[filters.pitcherHand, filters.runners.gate, filters.runners.empty, filters.runners.first, filters.runners.second, filters.runners.third]', function(filters) {
            $scope.runStats();
        }, true);
        $scope.$watch('filters.date.start', function(filters) {
            $scope.filters.date.start_moment = moment($scope.filters.date.start);
            $scope.runStats();
        }, true);
        $scope.$watch('filters.date.end', function(filters) {
            $scope.filters.date.end_moment = moment($scope.filters.date.end).add('days', 1);
            $scope.runStats();
        }, true);
    }

    /**
     * Setup the controller
     */
    function init() {
        setupWatchers();
        $scope.loading = true;
        playerService.getAtBatsForBatter($scope.playerId, $scope.filters.date.start, $scope.filters.date.end).then(function(atbats) {
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
        } else if ($scope.filters.date.start_moment.isAfter(atbat.start_tfs_zulu) || $scope.filters.date.end_moment.isBefore(atbat.start_tfs_zulu)) {
            return false;
        } else if (!$scope.passesRunnerFilter(atbat)) {
            return false;
        }
        return true;
    }

    /**
     * checks to see if an at-bat passes only the runners filter object
     * 
     * @param {*}
     *            atbat - the atbat to check against the scope's filter object
     * @returns {Boolean} true if the atbat passes the filters
     */
    $scope.passesRunnerFilter = function(atbat) {
        var filter = $scope.filters.runners;
        if (atbat.pitch && atbat.pitch.length > 0 && (filter.empty || filter.first || filter.second || filter.third)) {
            var lastPitch = atbat.pitch[atbat.pitch.length - 1];
            if (filter.gate === 'OR') {
                return ((lastPitch.on_1b && filter.first) || (lastPitch.on_2b && filter.second) || (lastPitch.on_3b && filter.third) || (filter.empty && !lastPitch.on_1b && !lastPitch.on_2b && !lastPitch.on_3b));
            }
            if (filter.gate === 'AND') {
                if (filter.first && !lastPitch.on_1b) {
                    return false;
                }
                if (filter.second && !lastPitch.on_2b) {
                    return false;
                }
                if (filter.third && !lastPitch.on_3b) {
                    return false;
                }
                if (filter.empty && (lastPitch.on_1b || lastPitch.on_2b || lastPitch.on_3b)) {
                    return false;
                }
                return true;
            }
            return false;
        }
        return true;
    }

    init();
} ];