'use strict';

angular.module('pitchfxApp').directive('teamNavigator', [

    function()
    {
        return {
            restrict: 'E',
            scope: {},
            template: '/partials/teamNavigator.html',
            controller: 'RosterCtrl'
        };
    }
]);
