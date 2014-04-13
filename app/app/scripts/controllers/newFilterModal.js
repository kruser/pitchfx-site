'use strict';

angular.module('pitchfxApp').controller('NewfiltermodalCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance)
    {
        $scope.model = {};

        /**
         * Close the modal
         */
        $scope.dismiss = function()
        {
            $modalInstance.dismiss('cancel');
        };

        $scope.saveFilter = function()
        {
            $modalInstance.close($scope.model.filterName);
        };
    }
]);
