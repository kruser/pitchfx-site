'use strict';

angular.module('pitchfxApp').directive('filterList', ['Filters', '$log',
    function(filterService, $log)
    {
        return {
            templateUrl: '/partials/filterList.html',
            restrict: 'E',
            replace: true,
            link: function postLink(scope)
            {
                scope.filterService = filterService;

                scope.deleteFilter = function(filter, $event)
                {
                    $event.stopImmediatePropagation();
                    if (filter)
                    {
                        $log.debug('DELETING A FILTER: ' + filter.name);
                        filterService.unpinFilter(filter);
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
    }
]);
