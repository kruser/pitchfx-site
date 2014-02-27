'use strict';

angular.module('pitchfxApp').controller('SharingmodalCtrl', ['$scope', '$http', '$timeout', '$location', '$log', '$modalInstance', 'Filters',
    function($scope, $http, $timeout, $location, $log, $modalInstance, filtersService) {

        /**
         * Get the URL plus the filter
         */
        function getFilteredUrl() {
            var absUrl = $location.absUrl().split('?')[0].replace('localhost:9000', 'pitchfx.org'),
                filteredUrl = absUrl + '?filter=' + JSON.stringify(filtersService.filters);
            if (filtersService.pitchFilters) {
                filteredUrl += '&pitchFilters=' + JSON.stringify(filtersService.pitchFilters);
            }
            return filteredUrl;
        }

        $scope.model = {};
        $scope.model.url = getFilteredUrl();
        $scope.model.urlEncoded = encodeURI($scope.model.url);

        /**
         * Close the modal
         */
        $scope.dismiss = function() {
            $modalInstance.dismiss('cancel');
        };

        $timeout(function() {
            addthis.toolbox("#addthis_toolbox");
        }, 500);


    }
]);
