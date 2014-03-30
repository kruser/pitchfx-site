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
                        xAxis:
                        {
                            min: 0,
                            max: 9,
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
                                [$scope.max / 2, '#fcf8e3'],
                                [$scope.max, '#c71c22']
                            ],
                            min: 0,
                            max: $scope.max
                        },

                        series: [
                        {
                            borderWidth: 0,
                            tooltip:
                            {
                                headerFormat: 'Temperature<br/>',
                                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} </b>'
                            }
                        }]
                    });

                }
            }
        };
    }
]);
