'use strict';

angular.module('pitchfxApp').directive('teamNavigator', [

function()
{
    return {
        restrict : 'E',
        scope : {},
        templateUrl : '/partials/teamNavigator.html',
        controller : 'RosterCtrl',
        link : function linkFunc($scope)
        {
            $scope.isPitcher = function()
            {
                return function(player)
                {
                    return (player && player.pos === 'P');
                };
            };
            $scope.isPositionPlayer = function()
            {
                return function(player)
                {
                    return (player && player.pos !== 'P');
                };
            };
        }
    };
} ]);
