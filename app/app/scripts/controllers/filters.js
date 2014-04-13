'use strict';

/**
 * A controller that manages hitting stats for a player
 */
angular.module('pitchfxApp').controller('FiltersCtrl', [ '$scope', '$log', '$timeout', '$angularCacheFactory', '$routeParams', '$route', '$location', '$modal', 'Filters', function($scope, $log, $timeout, $angularCacheFactory, $routeParams, $route, $location, $modal, filterService)
{
    var initialized = false;
    $scope.filterService = filterService;

    /**
     * Gets the recommended starting date for the filters.
     * 
     * If we're in May or later, the starting date will be the 1st of the
     * current year. If we're earlier than May, the starting date will be the
     * 1st of the prior year.
     */
    function getStartingDate()
    {
        var currentMonth = moment().month(), currentYear = moment().year();
        if (currentMonth < 4)
        {
            /* last year */
            return moment([ currentYear - 1, 0, 1 ]).format('YYYY-MM-DD');
        }
        else
        {
            /* this year */
            return moment([ currentYear, 0, 1 ]).format('YYYY-MM-DD');
        }
    }

    /**
     * Set it up!
     */
    function init()
    {
        var filterCache = $angularCacheFactory('filterCache', {
            storageMode : 'localStorage',
            maxAge : 3600000,
            deleteOnExpire : 'aggressive',
            recycleFreq : 60000,
            cacheFlushInterval : 3600000,
        }), filtersFromUrl = $location.search().filter, parsedFilters, filtersFromCache;

        if (filtersFromUrl)
        {
            parsedFilters = JSON.parse(filtersFromUrl)[0];
            $scope.filters = parsedFilters;
        }
        else
        {
            filtersFromCache = filterCache.get('filters');
            if (filtersFromCache && filtersFromCache.name)
            {
                $scope.filters = filtersFromCache;
                $scope.filters.playerCard = ($scope.playerPosition === '1') ? 'pitcher' : 'batter';
                if ($scope.playerPosition === '1')
                {
                    $scope.filters.pitcherHand = '';
                }
                else if ($scope.playerBats !== 'S')
                {
                    $scope.filters.batterHand = '';
                }
            }
            else
            {
                $scope.filters = {
                    playerCard : ($scope.playerPosition === '1') ? 'pitcher' : 'batter',
                    pitcherHand : '',
                    batterHand : '',
                    date : {
                        start : getStartingDate(),
                        end : moment().format('YYYY-MM-DD'),
                    },
                    runners : {
                        gate : 'OR',
                    },
                    outs : {},
                    balls : {},
                    strikes : {},
                    gameType : {
                        R : true,
                    }
                };
            }
        }

        /*
         * Update the filter UI when they have been updated on the filterService
         */
        $scope.$watch('filterService.filters', function(filters)
        {
            if (filters)
            {
                $log.debug('TIME TO UPDATE FILTERS');
                $scope.filters = angular.copy(filters);
                filterCache.put('filters', filters);
            }
        });

        /*
         * Update the filterService when the filters UI has been touched
         */
        $scope.$watch('filters', function(filters)
        {
            $log.debug('FILTERS HAVE BEEN UPDATED');
            if (!angular.equals(filters, filterService.filters))
            {
                $log.debug('LOOKS LIKE A LEGIT CHANGE');
                $log.debug(filters);
                filterCache.put('filters', filters);
                if (initialized)
                {
                    $log.debug('RESETTING FILTER NAME');
                    filters.name = undefined;
                    _gaq.push([ '_trackEvent', 'filters', 'atbats', $scope.playerId ]);
                }
                filterService.filters = filters;
                initialized = true;
            }
        }, true);
    }

    /**
     * Save the current filter
     */
    $scope.pinFilter = function()
    {
        var modalInstance = $modal.open({
            templateUrl : '/partials/newFilterModal.html',
            controller : 'NewfiltermodalCtrl',
        });

        modalInstance.result.then(function(filterName)
        {
            $scope.filters.name = filterName;
            filterService.pinFilter(filterName, $scope.filters);
        });
    };

    init();
} ]);
