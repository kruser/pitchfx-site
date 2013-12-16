var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.filtersController = [ '$scope', '$log', '$timeout', 'playerService', 'statsService', function($scope, $log, $timeout, playerService, statsService) {

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
        $scope.$watch('[filters.pitcherHand, filters.batterHand, filters.runners.gate, filters.runners.empty, filters.runners.first, filters.runners.second, filters.runners.third]', function(filters) {
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
    }

    init();
} ];