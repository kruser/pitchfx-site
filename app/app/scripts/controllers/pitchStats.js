'use strict';

angular.module('pitchfxApp').controller('PitchstatsCtrl', ['$rootScope', '$scope', '$log', '$timeout', '$location', 'Filters', 'Pitches',
    function($rootScope, $scope, $log, $timeout, $location, filtersService, pitchesService)
    {

        var rawPitches = [],
            filtersFromUrl = $location.search().pitchFilters,
            zones;

        $scope.loading = true;
        $scope.filtersService = filtersService;
        $scope.pitchTypes = [];
        $scope.pitchCount = 0;
        $scope.pitchSpeeds = {
            categories: [],
            series: [],
        };
        $scope.model = {
            zoneCharts: [
            {
                title: 'Swing Rate',
                group: 'Pitch Results',
                id: 'swingRate',
                max: 0.800,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getSwingRates();
                }
            },
            {
                title: 'Contact Rate',
                group: 'Pitch Results',
                id: 'contactRate',
                max: 0.600,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getContactRates();
                }
            },
            {
                title: 'Whiff Rate',
                group: 'Pitch Results',
                id: 'whiffRate',
                max: 0.400,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getWhiffRates();
                }
            },
            {
                title: 'Called Strike Rate',
                group: 'Pitch Results',
                id: 'calledStrikeRate',
                max: 0.500,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getCalledStrikeRates();
                }
            },
            {
                title: 'Ball In Play Rate',
                group: 'Pitch Results',
                id: 'bipRate',
                max: 0.400,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getBIPRates();
                }
            },
            {
                title: 'Contact/Swing',
                group: 'Swing Results',
                id: 'contactPerSwing',
                max: 0.800,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getContactPerSwingRates();
                }
            },
            {
                title: 'Whiffs/Swing',
                group: 'Swing Results',
                id: 'whiffsPerSwing',
                max: 0.400,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getWhiffsPerSwingRates();
                }
            },
            {
                title: 'Fouls/Swing',
                group: 'Swing Results',
                id: 'foulsPerSwing',
                max: 0.500,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getFoulsPerSwingRates();
                }
            },
            {
                title: 'BIP/Swing',
                group: 'Swing Results',
                id: 'bipPerSwing',
                max: 0.500,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getBIPPerSwingRates();
                }
            },
            {
                title: 'Grounders/BIP',
                group: 'Batted Ball Results',
                id: 'grounders',
                max: 0.700,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getGrounderRates();
                }
            },
            {
                title: 'Linedrives/BIP',
                group: 'Batted Ball Results',
                id: 'liners',
                max: 0.400,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getLinerRates();
                }
            },
            {
                title: 'Flyballs/BIP',
                group: 'Batted Ball Results',
                id: 'flyballs',
                max: 0.500,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getFlyballRates();
                }
            },
            {
                title: 'Popups/BIP',
                group: 'Batted Ball Results',
                id: 'popups',
                max: 0.600,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getPopupRates();
                }
            },
            {
                title: 'wOBA/BIP',
                group: 'Sabermetric Results',
                id: 'woba',
                max: 0.500,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getWOBARates();
                }
            },
            {
                title: 'BABIP',
                group: 'Sabermetric Results',
                id: 'babip',
                max: 0.400,
                generator: function()
                {
                    $scope.model.zonePoints = zones.getBABIPRates();
                }
            }, ],
        };

        $scope.model.selectedZoneChart = $scope.model.zoneCharts[0];

        if (filtersFromUrl)
        {
            $scope.pitchFilters = JSON.parse(filtersFromUrl);
        }
        else
        {
            $scope.pitchFilters = {
                pitchType:
                {}
            };
        }

        /**
         * Setup the controller
         */
        function init()
        {
            $scope.$watch('filtersService.filters', function(atbatFilters)
            {
                filtersService.loadingData = true;
                pitchesService.getPitches($scope.playerId, atbatFilters).then(function(pitches)
                {
                    rawPitches = pitches;
                    $scope.pitchCount = pitches.length;
                    $scope.loading = false;
                    filtersService.loadingData = false;
                    regenPitchStats();
                });
            }, true);
            $scope.$watch('pitchFilters', function(pitchFilters)
            {
                $scope.filtersService.pitchFilters = pitchFilters;
                $timeout(function()
                {
                    regenPitchStats();
                }, 10);
                _gaq.push(['_trackEvent', 'filters', 'pitches', $scope.playerId]);
            }, true);
            $scope.$watch('model.selectedZoneChart', function()
            {
                renderZoneChart();
            }, true);
        }

        /**
         * To be run whenever the atbat or pitch filters have changed
         */
        function regenPitchStats()
        {
            if ($scope.loading)
            {
                return;
            }

            $log.debug('Genearating pitch stats');
            aggregatePitchStats();
            $timeout(function()
            {
                renderPitchSpeeds();
                renderZoneChart();
            }, 10);
        }

        /**
         * Add a selected pitch to the list
         *
         * @param {string}
         *            pitchCode - like FF, FC, SL, etc.
         */
        $scope.togglePitchSelection = function(pitchCode)
        {
            $scope.pitchFilters.pitchType[pitchCode] = !($scope.pitchFilters.pitchType[pitchCode]);
        };

        /**
         * Render the pitch zones based on the currently selected chart
         */
        function renderZoneChart()
        {
            if (!zones)
            {
                return;
            }

            $scope.model.selectedZoneChart.generator();
        }

        /**
         * Render pitch speeds chart
         */
        function renderPitchSpeeds()
        {
            new Highcharts.Chart(
            {
                chart:
                {
                    type: 'area',
                    zoomType: 'x',
                    renderTo: 'pitchSpeeds',
                    spacingBottom: 0,
                    spacingLeft: 0,
                    spacingRight: 0
                },
                credits:
                {
                    text: 'BaseballMod.com',
                    href: ''
                },
                title:
                {
                    text: '',
                    enabled: false
                },
                xAxis:
                {
                    categories: $scope.pitchSpeeds.categories,
                    title:
                    {
                        text: 'MPH',
                    }
                },
                yAxis:
                {
                    title:
                    {
                        text: 'Pitch Frequency'
                    },
                },
                tooltip:
                {
                    shared: true,
                },
                plotOptions:
                {
                    area:
                    {
                        stacking: 'normal',
                        lineColor: '#666666',
                        lineWidth: 1,
                        marker:
                        {
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
        function aggregatePitchStats()
        {
            var pitchTypes = {}, pitchSpeeds = {}, minSpeed, maxSpeed, pitch, pitchCode, pitchTypeFilters = $scope.pitchFilters.pitchType,
                havePitchTypeFilters = false,
                key, i, aggregator, speed, hipTrajectory, speedKey, pitchTypeKey, model;
            zones = new pitchfx.Zones();

            for (key in pitchTypeFilters)
            {
                if (pitchTypeFilters[key])
                {
                    havePitchTypeFilters = true;
                    break;
                }
            }

            $log.debug('Do we have pitch filters?: ' + havePitchTypeFilters);

            if (rawPitches)
            {
                for (i = 0; i < rawPitches.length; i++)
                {
                    pitch = new pitchfx.Pitch(rawPitches[i]);
                    pitchCode = pitch.getPitchType();

                    aggregator = pitchTypes[pitchCode];
                    if (!aggregator)
                    {
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

                    if (pitch.isBall())
                    {
                        aggregator.ball++;
                    }
                    else
                    {
                        aggregator.strike++;
                    }

                    if (pitch.isSwing())
                    {
                        aggregator.swing++;
                    }
                    if (pitch.isBallInPlay())
                    {
                        aggregator.bip++;
                    }
                    if (pitch.isFoul())
                    {
                        aggregator.foul++;
                    }
                    if (pitch.isHit())
                    {
                        aggregator.hit++;
                    }
                    if (pitch.isOut())
                    {
                        aggregator.out++;
                    }
                    if (pitch.isWhiff())
                    {
                        aggregator.whiff++;
                    }
                    hipTrajectory = pitch.getHipTrajectory();
                    if (hipTrajectory === 'grounder')
                    {
                        aggregator.grounder++;
                    }
                    else if (hipTrajectory === 'liner')
                    {
                        aggregator.liner++;
                    }
                    else if (hipTrajectory === 'flyball')
                    {
                        aggregator.flyball++;
                    }
                    else if (hipTrajectory === 'popup')
                    {
                        aggregator.popup++;
                    }

                    /* jshint maxdepth:5 */
                    if (!havePitchTypeFilters || pitchTypeFilters[pitchCode])
                    {
                        speed = parseInt(pitch.start_speed, 10);
                        if (speed)
                        {
                            if (!minSpeed || minSpeed > speed)
                            {
                                minSpeed = speed;
                            }
                            if (!maxSpeed || maxSpeed < speed)
                            {
                                maxSpeed = speed;
                            }

                            speedKey = speed + ':' + pitchCode;
                            if (pitchSpeeds[speedKey])
                            {
                                pitchSpeeds[speedKey]++;
                            }
                            else
                            {
                                pitchSpeeds[speedKey] = 1;
                            }
                        }

                        /* Build the pitches 2d array */
                        zones.addPitch(pitch);
                    }
                }
            }

            model = [];
            for (pitchTypeKey in pitchTypes)
            {
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
        function buildPitchSpeedSeries(pitchSpeeds, minSpeed, maxSpeed, pitchTypes)
        {
            $log.debug(pitchTypes);
            $scope.pitchSpeeds.categories = pitchTypes;
            var series = [],
                vertical, key, frequency, allSpeeds = [],
                j = 0,
                i = 0;
            for (j = 0; j < pitchTypes.length; j++)
            {
                vertical = {
                    name: pitchfx.Pitch.getPitchDisplayName(pitchTypes[j]),
                    data: [],
                };
                for (i = minSpeed; i <= maxSpeed; i++)
                {
                    if (j === 0)
                    {
                        allSpeeds.push(i);
                    }
                    key = i + ':' + pitchTypes[j];
                    frequency = pitchSpeeds[key];
                    if (frequency)
                    {
                        vertical.data.push(frequency);
                    }
                    else
                    {
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
