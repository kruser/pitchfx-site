var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.filtersController = [ '$scope', '$log', '$timeout', '$angularCacheFactory', '$routeParams', '$route', '$location', 'filtersService', function($scope, $log, $timeout, $angularCacheFactory, $routeParams, $route, $location, filtersService) {
    var filterCache = $angularCacheFactory('filterCache', {
        storageMode : 'localStorage',
        maxAge : 3600000,
        deleteOnExpire : 'aggressive',
        recycleFreq : 60000,
        cacheFlushInterval : 3600000,
    });

    var filtersFromUrl = $location.search().filter;
    if (filtersFromUrl) {
        var parsedFilters = JSON.parse(filtersFromUrl)[0];
        $scope.filters = parsedFilters;
    } else {
        var filtersFromCache = filterCache.get('filters');
        if (filtersFromCache && filtersFromCache.length > 0) {
            $scope.filters = filtersFromCache[0];
            $scope.filters.playerCard = ($scope.playerPosition === '1') ? 'pitcher' : 'batter';
            if ($scope.playerPosition === '1') {
                $scope.filters.pitcherHand = '';
            } else if ($scope.playerBats !== 'S') {
                $scope.filters.batterHand = '';
            }
        } else {
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

    $scope.$watch('[filters]', function(filters) {
        filterCache.put('filters', filters);
        filtersService.filters = filters;
        _gaq.push(['_trackEvent', 'filters', 'atbats', $scope.playerId]);
    }, true);

    /**
     * Gets the recommended starting date for the filters.
     * 
     * If we're in May or later, the starting date will be the 1st of the
     * current year. If we're earlier than May, the starting date will be the
     * 1st of the prior year.
     */
    function getStartingDate() {
        var currentMonth = moment().month();
        var currentYear = moment().year();
        if (currentMonth < 4) {
            /* last year */
            return moment([ currentYear - 1, 0, 1 ]).format('YYYY-MM-DD');
        } else {
            /* this year */
            return moment([ currentYear, 0, 1 ]).format('YYYY-MM-DD');
        }
    }

} ];