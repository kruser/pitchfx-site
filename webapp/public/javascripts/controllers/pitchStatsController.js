var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.pitchStatsController = [ '$scope', '$log', '$timeout', 'filtersService', 'pitchesService', function($scope, $log, $timeout, filtersService, pitchesService) {

    $scope.loading = true;
    $scope.filtersService = filtersService;

    /**
     * Setup the controller
     */
    function init() {
        $scope.$watch('filtersService.filters', function(filters) {
            pitchesService.getPitches($scope.playerId, $scope.playerType, filters).then(function(pitches) {
                $scope.pitches = pitches;
                $scope.loading = false;
            });
        }, true);
    }

    init();
} ];