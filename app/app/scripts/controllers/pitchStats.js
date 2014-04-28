'use strict';

angular.module('pitchfxApp').controller('PitchstatsCtrl', ['$rootScope', '$scope', '$log', '$timeout', '$location', 'Filters', 'Pitches', 'Charting',
    function($rootScope, $scope, $log, $timeout, $location, filtersService, pitchesService, chartingService)
    {

        var rawPitches = [],
            filtersFromUrl = $location.search().pitchFilters,
            zones, hitZoneTrajectories = {}, hitZonesChart, hitZonesDestroyFunction;

        $scope.loading = true;
        $scope.pitcherCard = false;
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
                atbatFilters = atbatFilters ||
                {};
                $scope.pitcherCard = (atbatFilters.playerCard !== 'batter');
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
                if ($scope.pitcherCard)
                {
                    renderPitchSpeeds();
                }
                else
                {
                    renderHitLocationsByZone();
                }
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
         * Renders the hits by location scatter chart
         */
        function renderHitLocationsByZone()
        {
            var series = [],
                trajectory;

            $log.debug(hitZoneTrajectories);

            for (trajectory in hitZoneTrajectories)
            {
                series.push(
                {
                    name: trajectory,
                    data: hitZoneTrajectories[trajectory]
                });
            }

            /* Add a strike zone */
            series.push(
            {
                name: 'Zone',
                type: 'line',
                color: '#3a87ad',
                marker:
                {
                    enabled: false
                },
                showInLegend: false,
                enableMouseTracking: false,
                data: [
                    [180, -215],
                    [180, -535],
                    [570, -535],
                    [570, -215],
                    [180, -215],
                ]
            });

            $log.debug(series);

            if (hitZonesDestroyFunction)
            {
                hitZonesDestroyFunction();
            }
            hitZonesChart = new Highcharts.Chart(
            {
                chart:
                {
                    type: 'scatter',
                    renderTo: 'hitLocationsByZone',
                    backgroundColor: 'transparent',
                    plotBackgroundImage: '/images/stadiums/grid.svg',
                },
                credits:
                {
                    text: 'BaseballMod.com',
                    href: ''
                },
                title:
                {
                    text: '',
                },
                subtitle:
                {
                    text: 'Catcher point-of-view',
                    align: 'left'
                },
                xAxis:
                {
                    min: 0,
                    max: 750,
                    labels:
                    {
                        enabled: false,
                    },
                    title:
                    {
                        enabled: false,
                    },
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    minorTickLength: 0,
                    tickLength: 0,
                    plotLines: [
                    {
                        value: 250,
                        color: 'green',
                        dashStyle: 'shortdash',
                        width: 2,
                    },
                    {
                        value: 500,
                        color: 'green',
                        dashStyle: 'shortdash',
                        width: 2,
                    }]
                },
                yAxis:
                {
                    max: 0,
                    min: -750,
                    labels:
                    {
                        enabled: false,
                    },
                    title:
                    {
                        enabled: false,
                    },
                    gridLineColor: 'transparent',
                    plotLines: [
                    {
                        value: -250,
                        color: 'green',
                        dashStyle: 'shortdash',
                        width: 2,
                    },
                    {
                        value: -500,
                        color: 'green',
                        dashStyle: 'shortdash',
                        width: 2,
                    }]
                },
                plotOptions:
                {
                    series:
                    {
                        animation: false
                    },
                },
                series: series,
                exporting:
                {
                    enabled: false
                }
            });
            $timeout(function()
            {
                hitZonesDestroyFunction = chartingService.keepSquare(hitZonesChart);
            }, 100);
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
            hitZoneTrajectories = {};

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
                            contact: 0,
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
                    if (pitch.isBallInPlay() || pitch.isFoul())
                    {
                        aggregator.contact++;
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
                    if (pitchCode !== 'IN' && (!havePitchTypeFilters || pitchTypeFilters[pitchCode]))
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
                        addHitZone(pitch);
                    }
                }
            }

            model = [];
            for (pitchTypeKey in pitchTypes)
            {
                model.push(pitchTypes[pitchTypeKey]);
            }
            $scope.pitchTypes = model;
            if ($scope.pitcherCard)
            {
                buildPitchSpeedSeries(pitchSpeeds, minSpeed, maxSpeed, Object.keys(pitchTypes));
            }
        }

        /**
         * Add the pitch to the hit zones
         *
         */
        function addHitZone(pitch)
        {
            if (!pitch.hip || !pitch.hip.trajectory)
            {
                return;
            }

            if (!hitZoneTrajectories[pitch.hip.trajectory])
            {
                hitZoneTrajectories[pitch.hip.trajectory] = [];
            }

            var col = 0,
                row = 0;

            if (pitch.px < -0.4)
            {
                col = 0;
            }
            else if (pitch.px >= 0.4)
            {
                col = 2;
            }
            else
            {
                col = 1;
            }

            if (pitch.pz < 1.75)
            {
                row = 2;
            }
            else if (pitch.pz > 3.25)
            {
                row = 0;
            }
            else
            {
                row = 1;
            }

            hitZoneTrajectories[pitch.hip.trajectory].push([pitch.hip.x + (col * 250), 0 - pitch.hip.y - (row * 250)]);
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
                if (vertical.name === 'Other')
                {
                    continue;
                }
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
