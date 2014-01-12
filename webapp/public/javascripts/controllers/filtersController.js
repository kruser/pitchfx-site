var controllers = controllers || {};

/**
 * A controller that manages hitting stats for a player
 */
controllers.filtersController = [ '$scope', '$log', '$timeout', 'filtersService', function($scope, $log, $timeout, filtersService) {

    $scope.filters = {
        pitcherHand : '',
        batterHand : '',
        date : {
            start : '2010-01-01',
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
        }
    };

    $scope.$watch('[filters]', function(filters) {
        filtersService.filters = filters;
    }, true);

} ];