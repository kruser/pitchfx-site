'use strict';

angular.module('pitchfxApp').service('Charting', ['$log', '$window',
    function($log, $window)
    {
        /**
         * Highcharts has native support for charts that are 100% width, but the
         * height of the chart is a fixed pixel amount. This doesn't fit nicely with
         * a responsive grid when you expect a chart to stay square.
         *
         * When you pass a highchart into this function it will keep the height the
         * same as the width, based on changes to the window.
         *
         * Note this function sets up a window resize listener and doesn't destroy
         * it. Don't create your charts too often. Instead, create it once and alter
         * the data series.
         *
         * @param {*}
         *            highchart - the highchart to keep square
         * @returns {function} a funtion to call when you want to destroy the
         *          bindings
         */
        this.keepSquare = function(highchart)
        {
            squareChart(highchart);

            var rs = function()
            {
                squareChart(highchart);
            }, destroy = function()
                {
                    angular.element($window).unbind('resize', rs);
                };

            angular.element($window).bind('resize', rs);
            return destroy;
        };

        /**
         * Resize the chart height to the width of the parent
         *
         * @param {*}
         *            highchart - the highchart to keep square
         */
        function squareChart(highchart)
        {
            if (highchart)
            {
                var square = highchart.container.parentNode.offsetWidth;
                highchart.setSize(square, square, false);
            }
        }
    }
]);
