var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.battingStatsController = [ '$scope', '$log', '$timeout', 'filtersService', 'statsService', 'chartingService', function($scope, $log, $timeout, filtersService, statsService, chartingService) {

    var hipChart = null;
    var hipScatter = null;
    var hipScatterDestroyFunction = null;
    $scope.loading = true;
    $scope.filtersService = filtersService;

    /**
     * Setup the controller
     */
    function init() {
        $scope.$watch('filtersService.filters', function(filters) {
            filtersService.loadingData = true;
            statsService.getStats($scope.playerId, $scope.playerType, filters).then(function(stats) {
                $scope.stats = stats;
                renderCharts();
                $scope.loading = false;
                filtersService.loadingData = false;
            });
        }, true);
    }

    /**
     * Renders advanced charts
     */
    function renderCharts() {
        /* render charts with a timeout to let the screen size snap first */
        $timeout(function() {
            renderHipTypes();
            renderHipScatter();
        }, 10);
    }

    /**
     * The scatter plot for hit balls
     */
    function renderHipScatter() {
        if (hipScatterDestroyFunction) {
            hipScatterDestroyFunction();
        }
        var series = [];
        for ( var trajectory in $scope.stats.hitBalls) {
            series.push({
                name : trajectory,
                data : $scope.stats.hitBalls[trajectory]
            });
        }
        hipScatter = new Highcharts.Chart({
            chart : {
                type : 'scatter',
                renderTo : 'hipScatter',
                backgroundColor : 'transparent',
                plotBackgroundImage: '/images/stadiums/1.svg',
                margin : [ 0, 0, 0, 0 ],
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
                min : 0,
                max : 250,
                labels : {
                    enabled : true,
                },
                title : {
                    enabled : false,
                },
                lineWidth : 0,
                minorGridLineWidth : 0,
                lineColor : 'transparent',
                minorTickLength : 0,
                tickLength : 0
            },
            yAxis : {
                max : 0,
                min : -250,
                labels : {
                    enabled : true,
                },
                title : {
                    enabled : false,
                },
                gridLineColor : 'transparent'
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
            series : series
        });
        hipScatterDestroyFunction = chartingService.keepSquare(hipScatter);
    }

    /**
     * The pie chart for hit ball types
     */
    function renderHipTypes() {
        var series = [];
        for ( var trajectory in $scope.stats.hitBalls) {
            series.push([ trajectory, $scope.stats.hitBalls[trajectory].length ]);
        }
        if (!hipChart) {
            hipChart = new Highcharts.Chart({
                chart : {
                    renderTo : 'hipTypes',
                    margin : [ 0, 0, 0, 0 ],
                    spacingTop : 0,
                    spacingBottom : 0,
                    spacingLeft : 0,
                    spacingRight : 0
                },
                credits : {
                    enabled : false
                },
                plotOptions : {
                    pie : {
                        size : '100%',
                        dataLabels : {
                            color : '#eee',
                            distance : -40,
                            enabled : true,
                            format : '<b>{point.name}</b><br>{point.y} ({point.percentage:.1f}%)'
                        }
                    }
                },
                title : {
                    text : '',
                    enabled : false
                },
                series : [ {
                    name : 'Hit Balls',
                    type : 'pie',
                    data : series
                } ]
            });
            chartingService.keepSquare(hipChart);
        } else {
            hipChart.series[0].setData(series, true);
        }
    }

    init();
} ];