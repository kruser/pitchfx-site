'use strict';

angular.module('pitchfxApp').directive('teamNavigator', [

    function()
    {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: '/partials/teamNavigator.html',
            controller: 'RosterCtrl'
        };
    }
]);
