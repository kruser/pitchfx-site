'use strict';

angular.module('pitchfxApp').controller('PitchstatsCtrl', ['$rootScope', '$scope', '$log', '$timeout', '$location', 'Filters', 'Pitches', 'Charting',
    function($rootScope, $scope, $log, $timeout, $location, filtersService, pitchesService, chartingService) {

        var whiffsDestroyFunction,
            whiffSeries = [],
            wobaDestroyFunction,
            wobaSeries = [],
            rawPitches = [],
            filtersFromUrl = $location.search().pitchFilters,
            strikeZone = {
                name: 'Zone',
                type: 'line',
                color: '#3a87ad',
                marker: {
                    enabled: false
                },
                showInLegend: false,
                enableMouseTracking: false,
                data: [
                    [-0.709, 3.5],
                    [0.709, 3.5],
                    [0.709, 1.5],
                    [-0.709, 1.5],
                    [-0.709, 3.5]
                ]
            };

        $scope.loading = true;
        $scope.filtersService = filtersService;
        $scope.pitchTypes = [];
        $scope.pitchCount = 0;
        $scope.pitchSpeeds = {
            categories: [],
            series: [],
        };

        if (filtersFromUrl) {
            $scope.pitchFilters = JSON.parse(filtersFromUrl);
        } else {
            $scope.pitchFilters = {
                pitchType: {}
            };
        }

        /**
         * Setup the controller
         */
        function init() {
            $scope.$watch('filtersService.filters', function(atbatFilters) {
                filtersService.loadingData = true;
                pitchesService.getPitches($scope.playerId, atbatFilters).then(function(pitches) {
                    rawPitches = pitches;
                    $scope.pitchCount = pitches.length;
                    regenPitchStats();
                    $scope.loading = false;
                    filtersService.loadingData = false;
                });
            }, true);
            $scope.$watch('pitchFilters', function(pitchFilters) {
                $scope.filtersService.pitchFilters = pitchFilters;
                $timeout(function() {
                    regenPitchStats();
                }, 10);
                _gaq.push(['_trackEvent', 'filters', 'pitches', $scope.playerId]);
            }, true);
        }

        /**
         * To be run whenever the atbat or pitch filters have changed
         */
        function regenPitchStats() {
            $log.debug('Genearating pitch stats');
            aggregatePitchStats();
            $timeout(function() {
                renderPitchSpeeds();
                renderWhiffsChart();
                renderWobaChart();
            }, 10);
        }

        /**
         * Add a selected pitch to the list
         *
         * @param {string}
         *            pitchCode - like FF, FC, SL, etc.
         */
        $scope.togglePitchSelection = function(pitchCode) {
            $scope.pitchFilters.pitchType[pitchCode] = !($scope.pitchFilters.pitchType[pitchCode]);
        };

        /**
         * Render the wOBA bubble chart
         */
        function renderWobaChart() {
            if (wobaDestroyFunction) {
                wobaDestroyFunction();
            }
            var wobaChart = new Highcharts.Chart({
                chart: {
                    type: 'bubble',
                    zoomType: 'xy',
                    renderTo: 'wobaChart',
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        animation: false
                    }
                },
                title: {
                    text: '',
                    enabled: false,
                },
                xAxis: {
                    max: 2,
                    min: -2,
                    title: {
                        enabled: true,
                        text: 'Plate Offset (ft)'
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                },
                yAxis: {
                    max: 5,
                    min: 0,
                    title: {
                        text: 'Height (ft)'
                    }
                },
                legend: {
                    enabled: false,
                },
                series: [strikeZone, {
                    name: 'wOBA Value',
                    data: wobaSeries,
                    color: 'rgb(136, 193, 73)',
                    marker: {
                        fillOpacity: 0.1,
                        lineColor: 'rgb(136, 193, 73, 0.1)'
                    }
                }]
            });
            wobaDestroyFunction = chartingService.keepSquare(wobaChart);
        }

        /**
         * Renders the whiffs
         */
        function renderWhiffsChart() {
            if (whiffsDestroyFunction) {
                whiffsDestroyFunction();
            }
            var whiffChart = new Highcharts.Chart({
                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                    renderTo: 'whiffsChart',
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '',
                    enabled: false
                },
                xAxis: {
                    max: 2,
                    min: -2,
                    title: {
                        enabled: true,
                        text: 'Plate Offset (ft)'
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                },
                yAxis: {
                    max: 5,
                    min: 0,
                    title: {
                        text: 'Height (ft)'
                    }
                },
                legend: {
                    enabled: false,
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                    },
                    series: {
                        animation: false
                    }
                },
                series: [strikeZone, {
                    name: 'Whiffs',
                    color: 'rgba(223, 83, 83, .2)',
                    data: whiffSeries,
                }]
            });
            whiffsDestroyFunction = chartingService.keepSquare(whiffChart);
        }

        /**
         * Render pitch speeds chart
         */
        function renderPitchSpeeds() {
            new Highcharts.Chart({
                chart: {
                    type: 'area',
                    zoomType: 'x',
                    renderTo: 'pitchSpeeds',
                    spacingBottom: 0,
                    spacingLeft: 0,
                    spacingRight: 0
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '',
                    enabled: false
                },
                xAxis: {
                    categories: $scope.pitchSpeeds.categories,
                    title: {
                        text: 'MPH',
                    }
                },
                yAxis: {
                    title: {
                        text: 'Pitch Frequency'
                    },
                },
                tooltip: {
                    shared: true,
                },
                plotOptions: {
                    area: {
                        stacking: 'normal',
                        lineColor: '#666666',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1,
                            lineColor: '#666666'
                        }
                    }
                },
                series: $scope.pitchSpeeds.series
            });
        }

        /**
         * Pull together stats based on pitch types and place the resulting array on
         * the $scope
         *
         * @param {Array}
         *            pitches
         */
        function aggregatePitchStats() {
            var pitchTypes = {},
                pitchSpeeds = {},
                minSpeed,
                maxSpeed,
                pitch,
                pitchCode,
                pitchTypeFilters = $scope.pitchFilters.pitchType,
                havePitchTypeFilters = false,
                key, i, aggregator, wOba, speed, hipTrajectory, speedKey, pitchTypeKey, model;


            /* initialize to set the relative bubble sizes */
            wobaSeries = [
                [0, -10, 0.5],
                [0, -10, 3]
            ];
            whiffSeries = [];

            for (key in pitchTypeFilters) {
                if (pitchTypeFilters[key]) {
                    havePitchTypeFilters = true;
                    break;
                }
            }

            $log.debug('Do we have pitch filters?: ' + havePitchTypeFilters);

            if (rawPitches) {
                for (i = 0; i < rawPitches.length; i++) {
                    pitch = new pitchfx.Pitch(rawPitches[i]);
                    pitchCode = pitch.getPitchType();

                    aggregator = pitchTypes[pitchCode];
                    if (!aggregator) {
                        aggregator = {
                            pitchCode: pitchCode,
                            displayName: pitchfx.Pitch.getPitchDisplayName(pitch.getPitchType()),
                            count: 0,
                            ball: 0,
                            strike: 0,
                            swing: 0,
                            whiff: 0,
                            foul: 0,
                            bip: 0,
                            hit: 0,
                            out: 0,
                            grounder: 0,
                            liner: 0,
                            flyball: 0,
                            popup: 0,
                        };
                        pitchTypes[pitchCode] = aggregator;
                    }
                    aggregator.count++;

                    if (!havePitchTypeFilters || pitchTypeFilters[pitchCode]) {
                        wOba = pitch.getWeightedObaValue();
                        /*jshint  maxdepth:5 */
                        if (angular.isDefined(wOba)) {
                            if (angular.isDefined(pitch.px) && angular.isDefined(pitch.pz)) {
                                wobaSeries.push([pitch.px, pitch.pz, wOba]);
                            }
                        }
                    }

                    if (pitch.isBall()) {
                        aggregator.ball++;
                    } else {
                        aggregator.strike++;
                    }

                    if (pitch.isSwing()) {
                        aggregator.swing++;
                        /*jshint  maxdepth:5 */
                        if (pitch.isWhiff()) {
                            aggregator.whiff++;
                            if ((!havePitchTypeFilters || pitchTypeFilters[pitchCode]) && angular.isDefined(pitch.px) && angular.isDefined(pitch.pz)) {
                                whiffSeries.push([pitch.px, pitch.pz]);
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
                    hipTrajectory = pitch.getHipTrajectory();
                    if (hipTrajectory === 'grounder') {
                        aggregator.grounder++;
                    } else if (hipTrajectory === 'liner') {
                        aggregator.liner++;
                    } else if (hipTrajectory === 'flyball') {
                        aggregator.flyball++;
                    } else if (hipTrajectory === 'popup') {
                        aggregator.popup++;
                    }

                    if (!havePitchTypeFilters || pitchTypeFilters[pitchCode]) {
                        speed = parseInt(pitch.start_speed, 10);
                        if (speed) {

                            if (!minSpeed || minSpeed > speed) {
                                minSpeed = speed;
                            }
                            if (!maxSpeed || maxSpeed < speed) {
                                maxSpeed = speed;
                            }

                            speedKey = speed + ':' + pitchCode;
                            if (pitchSpeeds[speedKey]) {
                                pitchSpeeds[speedKey]++;
                            } else {
                                pitchSpeeds[speedKey] = 1;
                            }
                        }
                    }
                }
            }

            model = [];
            for (pitchTypeKey in pitchTypes) {
                model.push(pitchTypes[pitchTypeKey]);
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
        function buildPitchSpeedSeries(pitchSpeeds, minSpeed, maxSpeed, pitchTypes) {
            $log.debug(pitchTypes);
            $scope.pitchSpeeds.categories = pitchTypes;
            var series = [],
                vertical, key, frequency,
                allSpeeds = [],
                j = 0,
                i = 0;
            for (j = 0; j < pitchTypes.length; j++) {
                vertical = {
                    name: pitchfx.Pitch.getPitchDisplayName(pitchTypes[j]),
                    data: [],
                };
                for (i = minSpeed; i <= maxSpeed; i++) {
                    if (j === 0) {
                        allSpeeds.push(i);
                    }
                    key = i + ':' + pitchTypes[j];
                    frequency = pitchSpeeds[key];
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
    }
]);
