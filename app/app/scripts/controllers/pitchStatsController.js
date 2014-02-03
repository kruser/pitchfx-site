var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.pitchStatsController = [ '$rootScope', '$scope', '$log', '$timeout', 'filtersService', 'pitchesService', 'chartingService', function($rootScope, $scope, $log, $timeout, filtersService, pitchesService, chartingService) {

    var whiffsDestroyFunction = null;
    var whiffSeries = [];

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
    $scope.filters = {
        balls : {
            0 : false,
            1 : false,
            2 : false,
            3 : false,
        },
        strikes : {
            0 : false,
            1 : false,
            2 : false,
        },
    };

    /**
     * Setup the controller
     */
    function init() {
        $scope.$watch('filtersService.filters', function(atbatFilters) {
            filtersService.loadingData = true;
            pitchesService.getPitches($scope.playerId, $scope.playerType, atbatFilters, $scope.filters).then(function(pitches) {
                aggregatePitchStats(pitches);
                $timeout(function() {
                    renderPitchSpeeds();
                    renderWhiffsChart();
                }, 10);
                $scope.loading = false;
                filtersService.loadingData = false;
            });
        }, true);
    }

    /**
     * Render the wOBA bubble chart
     */
    function renderWobaChart() {
        if (whiffsDestroyFunction) {
            whiffsDestroyFunction();
        }
        var whiffChart = new Highcharts.Chart({
            chart : {
                type : 'scatter',
                zoomType : 'xy',
                renderTo : 'whiffsChart',
            },
            credits : {
                enabled : false
            },
            title : {
                text : '',
                enabled : false
            },
            xAxis : {
                max : 2,
                min : -2,
                title : {
                    enabled : true,
                    text : 'Plate Offset (ft)'
                },
                startOnTick : true,
                endOnTick : true,
                showLastLabel : true
            },
            yAxis : {
                max : 5,
                min : 0,
                title : {
                    text : 'Height (ft)'
                }
            },
            legend : {
                enabled : false,
            },
            plotOptions : {
                scatter : {
                    marker : {
                        radius : 5,
                        states : {
                            hover : {
                                enabled : true,
                                lineColor : 'rgb(100,100,100)'
                            }
                        }
                    },
                    states : {
                        hover : {
                            marker : {
                                enabled : false
                            }
                        }
                    },
                }
            },
            series : [ {
                name : 'Whiffs',
                color : 'rgba(223, 83, 83, .2)',
                data : whiffSeries,
            } ]
        });
        whiffsDestroyFunction = chartingService.keepSquare(whiffChart);
    }

    /**
     * Renders the whiffs
     */
    function renderWhiffsChart() {
        if (whiffsDestroyFunction) {
            whiffsDestroyFunction();
        }
        var whiffChart = new Highcharts.Chart({
            chart : {
                type : 'scatter',
                zoomType : 'xy',
                renderTo : 'whiffsChart',
            },
            credits : {
                enabled : false
            },
            title : {
                text : '',
                enabled : false
            },
            xAxis : {
                max : 2,
                min : -2,
                title : {
                    enabled : true,
                    text : 'Plate Offset (ft)'
                },
                startOnTick : true,
                endOnTick : true,
                showLastLabel : true
            },
            yAxis : {
                max : 5,
                min : 0,
                title : {
                    text : 'Height (ft)'
                }
            },
            legend : {
                enabled : false,
            },
            plotOptions : {
                scatter : {
                    marker : {
                        radius : 5,
                        states : {
                            hover : {
                                enabled : true,
                                lineColor : 'rgb(100,100,100)'
                            }
                        }
                    },
                    states : {
                        hover : {
                            marker : {
                                enabled : false
                            }
                        }
                    },
                }
            },
            series : [ {
                name : 'Whiffs',
                color : 'rgba(223, 83, 83, .2)',
                data : whiffSeries,
            } ]
        });
        whiffsDestroyFunction = chartingService.keepSquare(whiffChart);
    }

    /**
     * Render pitch speeds chart
     */
    function renderPitchSpeeds() {
        new Highcharts.Chart({
            chart : {
                type : 'area',
                zoomType : 'x',
                renderTo : 'pitchSpeeds',
                spacingTop : 0,
                spacingBottom : 0,
                spacingLeft : 0,
                spacingRight : 0
            },
            credits : {
                enabled : false
            },
            title : {
                text : '',
                enabled : false
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
        whiffSeries = [];
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
                        if (angular.isDefined(pitch.px) && angular.isDefined(pitch.pz)) {
                            whiffSeries.push([ pitch.px, pitch.pz ]);
                        }
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