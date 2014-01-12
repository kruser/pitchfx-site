var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.battingStatsController = [ '$scope', '$log', '$timeout', 'filtersService', 'statsService', function($scope, $log, $timeout, filtersService, statsService) {

    $scope.loading = true;
    $scope.filtersService = filtersService;

    /**
     * Setup the controller
     */
    function init() {
        $scope.$watch('filtersService.filters', function(filters) {
            statsService.getStats($scope.playerId, $scope.playerType, filters).then(function(stats) {
                $scope.stats = stats;
                $scope.renderCharts();
                $scope.loading = false;
            });
        }, true);
    }

    /**
     * Renders advanced charts
     */
    $scope.renderCharts = function() {
        /* render charts with a timeout to let the screen size snap first */
        $timeout(function() {
            $scope.renderHipTypes();
            $scope.renderHipScatter();
        }, 10);
    };

    /**
     * The scatter plot for hit balls
     */
    $scope.renderHipScatter = function() {
        var series = [];
        for ( var trajectory in $scope.stats.hitBalls) {
            series.push({
                name : trajectory,
                data : $scope.stats.hitBalls[trajectory]
            });
        }
        new Highcharts.Chart({
            chart : {
                type : 'scatter',
                renderTo : 'hipScatter',
                backgroundColor : 'transparent'
            },
            credits : {
                enabled : false
            },
            title : {
                text : 'Hit Balls'
            },
            xAxis : {
                min : 0,
                max : 250,
                labels : {
                    enabled : false,
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
                min : -250,
                max : 0,
                labels : {
                    enabled : false,
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
    };

    /**
     * The pie chart for hit ball types
     */
    $scope.renderHipTypes = function() {
        var series = [];
        for ( var trajectory in $scope.stats.hitBalls) {
            series.push([ trajectory, $scope.stats.hitBalls[trajectory].length ]);
        }
        new Highcharts.Chart({
            chart : {
                renderTo : 'hipTypes'
            },
            credits : {
                enabled : false
            },
            plotOptions : {
                pie : {
                    dataLabels : {
                        color : '#eee',
                        distance : -40,
                        enabled : true,
                        format : '<b>{point.name}</b><br>{point.y} ({point.percentage:.1f}%)'
                    }
                }
            },
            title : {
                text : 'Hit Balls'
            },
            series : [ {
                name : 'Hit Balls',
                type : 'pie',
                data : series
            } ]
        });
    };

    init();
} ];