'use strict';

/**
 * Provides an angularJS wrapper around the heatmap.js library
 */
angular.module('pitchfxApp').directive('heatmap', [function()
{
    return {
        template : '<div></div>',
        restrict : 'E',
        replace : true,
        scope : {
            'points' : '=',
            'max' : '=',
        },
        link : function($scope, element)
        {
            $scope.$watch('[points, max]', function()
            {
                redrawHeatmap();
            }, true);
            
            function redrawHeatmap()
            {
                if (!$scope.points || !$scope.max)
                {
                    return;
                }
                
                var config = {
                    radius : 20,
                    element : element[0],
                    visible : true,
                    opacity : 40,
                },
                /*global heatmapFactory:true */
                heatmap = heatmapFactory.create(config),
                i,
                j,
                zoneStat;
                
                for (i = 0; i < $scope.points.length; i++)
                {
                    for (j = 0; j < $scope.points[i].length; j++)
                    {
                        zoneStat = $scope.points[i][j];
                        if (zoneStat.stat)
                        {
                            heatmap.store.addDataPoint(i * 40, j * 40, zoneStat.stat * 1000);
                        }
                    }
                }
            }
        }
    };
} ]);
