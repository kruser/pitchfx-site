'use strict';

angular.module('pitchfxApp').directive('filters', [

    function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'playerId': '@',
                'playerPosition': '@',
                'playerBats': '@'
            },
            templateUrl: '/partials/filters.html',
            controller: 'FiltersCtrl',
        };
    }
]);
