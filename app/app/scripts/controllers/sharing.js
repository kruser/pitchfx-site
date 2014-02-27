'use strict';

angular.module('pitchfxApp').controller('SharingCtrl', [ '$scope', '$log', '$modal', function($scope, $log, $modal) {

    $scope.shareFilteredPage = function() {
        $modal.open({
            templateUrl : '/partials/sharingModal.html',
            controller : 'SharingmodalCtrl',
        });
    };

} ]);
