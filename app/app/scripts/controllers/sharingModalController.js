var controllers = controllers || {};

/**
 * A controller that manages all sharing
 */
controllers.sharingModalController = [ '$scope', '$location', '$log', '$modalInstance', 'filtersService', function($scope, $location, $log, $modalInstance, filtersService) {

    $scope.model = {
        url : getFilteredUrl(),
    };

    /**
     * Close the modal
     */
    $scope.dismiss = function() {
        $modalInstance.dismiss('cancel');
    };
    
    /**
     * Get the URL plus the filter
     */
    function getFilteredUrl() {
        var absUrl = $location.absUrl().split('?')[0];
        return absUrl + '?filter=' + JSON.stringify(filtersService.filters);
    }

} ];