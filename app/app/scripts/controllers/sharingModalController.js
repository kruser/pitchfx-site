var controllers = controllers || {};

var addthis_config = {
    "data_track_addressbar" : true
};

/**
 * A controller that manages all sharing
 */
controllers.sharingModalController = [ '$scope', '$http', '$timeout', '$location', '$log', '$modalInstance', 'filtersService', function($scope, $http, $timeout, $location, $log, $modalInstance, filtersService) {

    $scope.model = {
        url : getFilteredUrl(),
    };

    /**
     * Close the modal
     */
    $scope.dismiss = function() {
        $modalInstance.dismiss('cancel');
    };

    $timeout(function() {
        addthis.toolbox("#addthis_toolbox");
    }, 500);

    /**
     * Get the URL plus the filter
     */
    function getFilteredUrl() {
        var absUrl = $location.absUrl().split('?')[0].replace('localhost:9000', 'pitchfx.org');
        var filteredUrl = absUrl + '?filter=' + JSON.stringify(filtersService.filters);
        if (filtersService.pitchFilters) {
            filteredUrl += '&pitchFilters=' + JSON.stringify(filtersService.pitchFilters);
        }
        return filteredUrl;
    }

} ];