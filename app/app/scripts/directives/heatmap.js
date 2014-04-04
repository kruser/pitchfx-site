'use strict';

/**
 * Provides an angularJS wrapper some heatmap library
 */
angular.module('pitchfxApp').directive('heatmap', [

    function()
    {
        return {
            template: '<div id="heatmap"></div>',
            restrict: 'E',
            replace: false,
            scope:
            {
                'points': '=',
                'max': '=',
                'chartName': '=',
            },
            link: function($scope)
            {
                $scope.$watch('[points, max, chartName]', function()
                {
                    redrawHeatmap();
                }, true);

                function redrawHeatmap()
                {
                    if (!$scope.points || !$scope.max || !$scope.chartName)
                    {
                        return;
                    }

                    console.log('MY MAX: ' + $scope.max);
                    console.log(pitchfx.Zones.gridToCsv($scope.points));
                    new Highcharts.Chart(
                    {
                        data:
                        {
                            csv: pitchfx.Zones.gridToCsv($scope.points)
                        },
                        chart:
                        {
                            type: 'heatmap',
                            renderTo: 'heatmap',
                        },

                        credits:
                        {
                            enabled: false
                        },
                        title:
                        {
                            text: $scope.chartName,
                            align: 'left'
                        },
                        subtitle:
                        {
                            text: 'Catcher point-of-view',
                            align: 'left'
                        },
                        xAxis:
                        {
                            min: 0,
                            max: 9,
                            minorTickLength: 0,
                            tickLength: 0,
                            labels:
                            {
                                enabled: false
                            }
                        },

                        yAxis:
                        {
                            title:
                            {
                                text: null
                            },
                            labels:
                            {
                                enabled: false
                            },
                            minPadding: 0,
                            maxPadding: 0,
                            startOnTick: false,
                            endOnTick: false,
                            min: 0,
                            max: 9
                        },

                        colorAxis:
                        {
                            stops: [
                                [0, '#033c73'],
                                [0.5, '#fcf8e3'],
                                [1, '#c71c22']
                            ],
                            min: 0,
                            max: $scope.max
                        },

                        series: [
                        {
                            borderWidth: 0,
                        },
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
                                [2, 2],
                                [2, 7],
                                [7, 7],
                                [7, 2],
                                [2, 2],
                            ]
                        }],
                        tooltip:
                        {
                            formatter: function()
                            {
                                return $scope.points[this.point.x][this.point.y].description;
                            }
                        }
                    });

                }
            }
        };
    }
]);
