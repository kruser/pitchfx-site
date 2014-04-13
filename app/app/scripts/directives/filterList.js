'use strict';

angular.module('pitchfxApp').directive('filterList', [ 'Filters', function(filterService)
{
    return {
        templateUrl : '/partials/filterList.html',
        restrict : 'E',
        replace : true,
        link : function postLink(scope)
        {
            scope.filterService = filterService;

            scope.deleteFilter = function(filter)
            {
                if (filter)
                {
                    filterService.unpinFilter(filter.name);
                }
            };
            
            scope.setActiveFilter = function(filter)
            {
                if (filter)
                {
                    filterService.setActiveFilter(filter);
                }
            };
            
            scope.getCardAbbreviation = function(filter)
            {
                if (filter.playerCard === 'batter')
                {
                    return 'B';
                }
                else
                {
                    return 'P';
                }
            };
        }
    };
} ]);
