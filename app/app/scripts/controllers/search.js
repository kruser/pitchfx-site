'use strict';

/**
 * A controller that manages searching players
 */
angular.module('pitchfxApp').controller('SearchCtrl', ['$scope', '$log', '$window', 'Player',
    function($scope, $log, $window, playerService) {

        $scope.playersLoading = false;

        /* match theme.css */
        $scope.backgroundIndex = 'panorama-' + Math.floor((Math.random() * 5) + 1);

        /**
         * Search for players
         */
        $scope.searchPlayers = function(text) {
            $scope.playersLoading = true;
            return playerService.searchPlayers(text).then(function(players) {
                $scope.playersLoading = false;
                return players;
            });
        };

        /**
         * redirect to the player's page
         */
        $scope.playerSelected = function() {
            var player, url;
            if ($scope.playerSelection && $scope.playerSelection.id) {
                player = $scope.playerSelection;
                url = '/player/' + player.id + '/' + player.getUrlFriendlyName();
                $window.location.href = url;
            }
        };

    }
]);
