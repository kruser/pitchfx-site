'use strict';

angular.module('pitchfxApp').directive('filterList', function()
{
    return {
        templateUrl : '/partials/filterList.html',
        restrict : 'E',
        replace : true,
        link : function postLink(scope, element, attrs)
        {
        }
    };
});
