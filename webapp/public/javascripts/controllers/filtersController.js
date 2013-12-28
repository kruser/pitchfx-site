var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.filtersController = [ '$scope', '$log', '$timeout', 'playerService', 'statsService', function($scope, $log, $timeout, playerService, statsService) {

    $scope.filters = {
        pitcherHand : '',
        batterHand : '',
        date : {
            start : '2010-01-01',
            end : moment().format('YYYY-MM-DD'),
        },
        runners : {
            gate : 'OR',
            empty : false,
            first : false,
            second : false,
            third : false,
        },
        outs : {
            0 : false,
            1 : false,
            2 : false,
        }
    };

    /**
     * Get stats from the backend service
     */
    $scope.runStats = function() {
        statsService.getStats($scope.playerId, getStatType($scope.playerPosition), $scope.filters).then(function(result) {

        });
    };

    /**
     * Get our "type" based on position number.
     * 
     * @param {int}
     *            position
     * @returns {string} - the position type
     */
    function getStatType(position) {
        if (position === '1') {
            return 'pitcher';
        } else {
            return 'batter';
        }
    }

    /**
     * Sets up all the watchers on filter variables
     */
    function setupWatchers() {
        $scope.$watch('[filters.outs.0, filters.outs.1, filters.outs.2, filters.outs.3, filters.date.start, filters.date.end, filters.pitcherHand, filters.batterHand, filters.runners.gate, filters.runners.empty, filters.runners.first, filters.runners.second, filters.runners.third]', function(filters) {
            $scope.runStats();
        }, true);
    }

    /**
     * Setup the controller
     */
    function init() {
        setupWatchers();
    }

    init();
} ];