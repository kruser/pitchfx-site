var controllers = controllers || {};

/**
 * A controller that manages all sharing
 */
controllers.sharingController = [ '$scope', '$log', '$modal', 'filtersService', function($scope, $log, $modal, filtersService) {

    $scope.shareFilteredPage = function() {
        $modal.open({
            templateUrl : '/partials/sharingModal.html',
            controller : 'sharingModalController' ,
        });
    };

} ];