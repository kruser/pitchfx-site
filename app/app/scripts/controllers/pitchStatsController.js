var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.pitchStatsController = [ '$rootScope', '$scope', '$log', '$timeout', 'filtersService', 'pitchesService', function($rootScope, $scope, $log, $timeout, filtersService, pitchesService) {

    $scope.loading = true;
    $scope.filtersService = filtersService;
    $scope.pitchTypes = [];
    $scope.model = {
        selectedPitch : {}
    };
    $scope.pitchSpeeds = {
        categories : [],
        series : [],
    };

    /**
     * Setup the controller
     */
    function init() {
        $scope.$watch('filtersService.filters', function(filters) {
            filtersService.loadingData = true;
            pitchesService.getPitches($scope.playerId, $scope.playerType, filters).then(function(pitches) {
                aggregatePitchStats(pitches);
                $timeout(function() {
                    renderPitchSpeeds();
                }, 10);
                $scope.loading = false;
                filtersService.loadingData = false;
            });
        }, true);
    }

    /**
     * REnder pitch speeds chart
     */
    function renderPitchSpeeds() {
        new Highcharts.Chart({
            chart : {
                type : 'area',
                zoomType : 'x',
                renderTo : 'pitchSpeeds'
            },
            credits : {
                enabled : false
            },
            title : {
                text : 'Pitch Speeds'
            },
            xAxis : {
                categories : $scope.pitchSpeeds.categories,
                title : {
                    text : 'MPH',
                }
            },
            yAxis : {
                title : {
                    text : 'Pitch Frequency'
                },
            },
            tooltip : {
                shared : true,
            },
            plotOptions : {
                area : {
                    stacking : 'normal',
                    lineColor : '#666666',
                    lineWidth : 1,
                    marker : {
                        lineWidth : 1,
                        lineColor : '#666666'
                    }
                }
            },
            series : $scope.pitchSpeeds.series
        });
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
        var pitchSpeeds = {};
        var minSpeed = null;
        var maxSpeed = null;
        if (pitches) {
            for ( var i = 0; i < pitches.length; i++) {
                var pitch = new pojos.Pitch(pitches[i]);
                var pitchCode = pitch.getPitchType();
                var aggregator = pitchTypes[pitchCode];
                if (!aggregator) {
                    aggregator = {
                        pitchCode : pitchCode,
                        displayName : pojos.Pitch.getPitchDisplayName(pitch.getPitchType()),
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
                var speed = parseInt(pitch.start_speed, 10);
                if (speed) {

                    if (!minSpeed || minSpeed > speed) {
                        minSpeed = speed;
                    }
                    if (!maxSpeed || maxSpeed < speed) {
                        maxSpeed = speed;
                    }

                    var speedKey = speed + ':' + pitchCode;
                    if (pitchSpeeds[speedKey]) {
                        pitchSpeeds[speedKey]++;
                    } else {
                        pitchSpeeds[speedKey] = 1;
                    }
                }
            }
        }

        var model = [];
        for ( var key in pitchTypes) {
            model.push(pitchTypes[key]);
        }
        $scope.pitchTypes = model;
        buildPitchSpeedSeries(pitchSpeeds, minSpeed, maxSpeed, Object.keys(pitchTypes));
    }

    /**
     * Builds up the series and categories necessary to print the highcharts
     * 
     * @param {Object}
     *            pitchSpeeds
     * @param {number}
     *            minSpeed
     * @param {number}
     *            maxSpeed
     * @param {Array}
     *            pitchCodes
     */
    function buildPitchSpeedSeries(pitchSpeeds, minSpeed, maxSpeed, pitchTypes, pitchCodes) {
        $log.debug(pitchTypes);
        $scope.pitchSpeeds.categories = pitchTypes;
        var series = [];

        var allSpeeds = [];
        for ( var j = 0; j < pitchTypes.length; j++) {
            var vertical = {
                name : pojos.Pitch.getPitchDisplayName(pitchTypes[j]),
                data : [],
            };
            for ( var i = minSpeed; i <= maxSpeed; i++) {
                if (j === 0) {
                    allSpeeds.push(i);
                }
                var key = i + ':' + pitchTypes[j];
                var frequency = pitchSpeeds[key];
                if (frequency) {
                    vertical.data.push(frequency);
                } else {
                    vertical.data.push(null);
                }
            }
            series.push(vertical);
        }
        $scope.pitchSpeeds.categories = allSpeeds;
        $scope.pitchSpeeds.series = series;
    }

    init();
} ];