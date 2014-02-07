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

    $log.debug($routeParams);
    if ($routeParams.playerCard) {
        $scope.playerCard = $routeParams.playerCard;
    } else {
        $scope.playerCard = ($scope.playerPosition === '1') ? 'pitcher' : 'batter';
    }

    var filtersFromCache = filterCache.get('filters');
    if (filtersFromCache && filtersFromCache.length > 0) {
        $scope.filters = filtersFromCache[0];
        if ($scope.playerPosition === '1') {
            $scope.filters.pitcherHand = '';
        } else if ($scope.playerBats !== 'S') {
            $scope.filters.batterHand = '';
        }
    } else {
        $scope.filters = {
            pitcherHand : '',
            batterHand : '',
            date : {
                start : getStartingDate(),
                end : moment().format('YYYY-MM-DD'),
            },
            runners : {
                gate : 'OR',
                empty : false,
                first : false,
                second : false,
                third : false,
            },
            outs : {
                0 : false,
                1 : false,
                2 : false,
            },
            balls : {
                0 : false,
                1 : false,
                2 : false,
                3 : false,
            },
            strikes : {
                0 : false,
                1 : false,
                2 : false,
            },
            gameType : {
                S : false,
                R : true,
                P : false,
            }
        };
    }

    $scope.$watch('playerCard', function(playerCard) {
        if ($routeParams.playerCard !== playerCard) {
            $location.path('/' + $route.current.$$route.meta + '/' + playerCard);
        }
    }, true);

    $scope.$watch('[filters]', function(filters) {
        if ($scope.playerCard) {
            filterCache.put('filters', filters);
            filtersService.filters = filters;
        }
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