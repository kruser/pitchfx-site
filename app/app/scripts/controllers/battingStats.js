angular.module('pitchfxApp').controller('BattingstatsCtrl', ['$scope', '$log', '$timeout', 'Filters', 'Stats', 'Charting',
    function($scope, $log, $timeout, filtersService, statsService, chartingService)
    {

        var hipChart, hipScatter, hipScatterDestroyFunction;

        $scope.loading = true;
        $scope.filtersService = filtersService;

        /**
         * Setup the controller
         */
        function init()
        {
            $scope.$watch('filtersService.filters', function(filters)
            {
                filtersService.loadingData = true;
                statsService.getStats($scope.playerId, filters).then(function(stats)
                {
                    $scope.stats = stats;
                    renderCharts();
                    $scope.loading = false;
                    filtersService.loadingData = false;
                });
            }, true);
        }

        /**
         * Gets an HTML label for the tooltip of balls hit-in-play
         *
         * @param {string}
         *            hipType - one of (grounder|liner|flyball|popup)
         * @returns {string} the tooltip contents
         */
        function hipTypesTooltip()
        {
            $log.debug(this);
            var tooltip = '<b>Field Distribution</b>',
                fields = null;
            if ($scope.stats.hitBallDistribution && $scope.stats.hitBallDistribution[this.key])
            {
                fields = $scope.stats.hitBallDistribution[this.key];
                if (fields.L)
                {
                    tooltip += '<br><b>Left:</b> ' + fields.L + ' (' + (fields.L / this.y * 100).toFixed(1) + '%)';
                }
                if (fields.C)
                {
                    tooltip += '<br><b>Center:</b> ' + fields.C + ' (' + (fields.C / this.y * 100).toFixed(1) + '%)';
                }
                if (fields.R)
                {
                    tooltip += '<br><b>Right:</b> ' + fields.R + ' (' + (fields.R / this.y * 100).toFixed(1) + '%)';
                }
            }
            return tooltip;
        }

        /**
         * Renders advanced charts
         */
        function renderCharts()
        {
            /*
             * render charts with a timeout to let the screen size snap first
             */
            $timeout(function()
            {
                renderHipTypes();
                renderHipScatter();
            }, 10);
        }

        /**
         * The scatter plot for hit balls
         */
        function renderHipScatter()
        {
            var series = [],
                trajectory;

            if (hipScatterDestroyFunction)
            {
                hipScatterDestroyFunction();
            }
            for (trajectory in $scope.stats.hitBalls)
            {
                series.push(
                {
                    name: trajectory,
                    data: $scope.stats.hitBalls[trajectory]
                });
            }
            hipScatter = new Highcharts.Chart(
            {
                chart:
                {
                    type: 'scatter',
                    renderTo: 'hipScatter',
                    backgroundColor: 'transparent',
                    plotBackgroundImage: '/images/stadiums/1.svg',
                    margin: [0, 0, 0, 0],
                    spacingTop: 0,
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
                    min: 0,
                    max: 250,
                    labels:
                    {
                        enabled: true,
                    },
                    title:
                    {
                        enabled: false,
                    },
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    minorTickLength: 0,
                    tickLength: 0
                },
                yAxis:
                {
                    max: 0,
                    min: -250,
                    labels:
                    {
                        enabled: true,
                    },
                    title:
                    {
                        enabled: false,
                    },
                    gridLineColor: 'transparent'
                },
                plotOptions:
                {
                    series:
                    {
                        animation: false
                    },
                    scatter:
                    {
                        marker:
                        {
                            radius: 5,
                            states:
                            {
                                hover:
                                {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states:
                        {
                            hover:
                            {
                                marker:
                                {
                                    enabled: false
                                }
                            }
                        },
                    }
                },
                series: series
            });
            hipScatterDestroyFunction = chartingService.keepSquare(hipScatter);
        }

        /**
         * The pie chart for hit ball types
         */
        function renderHipTypes()
        {
            var series = [],
                trajectory;
            for (trajectory in $scope.stats.hitBalls)
            {
                series.push([trajectory, $scope.stats.hitBalls[trajectory].length]);
            }
            if (!hipChart)
            {
                hipChart = new Highcharts.Chart(
                {
                    chart:
                    {
                        renderTo: 'hipTypes',
                        margin: [0, 0, 0, 0],
                        spacingTop: 0,
                        spacingBottom: 0,
                        spacingLeft: 0,
                        spacingRight: 0
                    },
                    credits:
                    {
                        text: 'BaseballMod.com',
                        href: ''
                    },
                    plotOptions:
                    {
                        pie:
                        {
                            size: '100%',
                            dataLabels:
                            {
                                color: '#eee',
                                distance: -40,
                                enabled: true,
                                format: '<b>{point.name}</b><br>{point.y} ({point.percentage:.1f}%)'
                            }
                        }
                    },
                    tooltip:
                    {
                        formatter: hipTypesTooltip
                    },
                    title:
                    {
                        text: '',
                        enabled: false
                    },
                    series: [
                    {
                        name: 'Hit Balls',
                        type: 'pie',
                        data: series
                    }]
                });
                chartingService.keepSquare(hipChart);
            }
            else
            {
                hipChart.series[0].setData(series, true);
            }
        }

        init();
    }
]);
