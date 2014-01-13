var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.pitchStatsController = [ '$scope', '$log', '$timeout', 'filtersService', 'pitchesService', function($scope, $log, $timeout, filtersService, pitchesService) {

    $scope.loading = true;
    $scope.filtersService = filtersService;
    $scope.pitchTypes = [];

    /**
     * Setup the controller
     */
    function init() {
        $scope.$watch('filtersService.filters', function(filters) {
            pitchesService.getPitches($scope.playerId, $scope.playerType, filters).then(function(pitches) {
                aggregatePitchStats(pitches);
                $scope.loading = false;
            });
        }, true);
    }

    /**
     * Pull together stats based on pitch types and place the resulting array on
     * the $scope
     * 
     * @param {Array}
     *            pitches
     */
    function aggregatePitchStats(pitches) {
        var pitchTypes = {};
        if (pitches) {
            for ( var i = 0; i < pitches.length; i++) {
                var pitch = new pojos.Pitch(pitches[i]);
                var pitchCode = pitch.getPitchType();
                var aggregator = pitchTypes[pitchCode];
                if (!aggregator) {
                    aggregator = {
                        pitchCode : pitchCode,
                        displayName : pitch.getPitchDisplayName(),
                        count : 0,
                        ball : 0,
                        strike : 0,
                        swing : 0,
                        whiff : 0,
                        foul : 0,
                        bip : 0,
                        hit : 0,
                        out : 0,
                        grounder : 0,
                        liner : 0,
                        flyball : 0,
                        popup : 0,
                    };
                    pitchTypes[pitchCode] = aggregator;
                }
                aggregator.count++;
                if (pitch.isBall()) {
                    aggregator.ball++;
                } else {
                    aggregator.strike++;
                }

                if (pitch.isSwing()) {
                    aggregator.swing++;
                    if (pitch.isWhiff()) {
                        aggregator.whiff++;
                    }
                }
                if (pitch.isBallInPlay()) {
                    aggregator.bip++;
                }
                if (pitch.isFoul()) {
                    aggregator.foul++;
                }
                if (pitch.isHit()) {
                    aggregator.hit++;
                }
                if (pitch.isOut()) {
                    aggregator.out++;
                }
                var hipTrajectory = pitch.getHipTrajectory();
                if (hipTrajectory === 'grounder') {
                    aggregator.grounder++;
                } else if (hipTrajectory === 'liner') {
                    aggregator.liner++;
                } else if (hipTrajectory === 'flyball') {
                    aggregator.flyball++;
                } else if (hipTrajectory === 'popup') {
                    aggregator.popup++;
                }
            }
        }

        var model = [];
        for ( var key in pitchTypes) {
            model.push(pitchTypes[key]);
        }
        $scope.pitchTypes = model;
    }

    init();
} ];