goog.provide('kruser.controllers.searchController');

/**
 * A controller that manages searching players
 */
kruser.controllers.searchController = [ '$scope', '$log', '$location', 'playerService', function($scope, $log, $location, playerService) {

    $scope.battersLoading = false;
    $scope.pitchersLoading = false;

    /**
     * Search for players where the result is expected to be a batter
     */
    $scope.searchBatters = function(text) {
        $scope.battersLoading = true;
        return playerService.searchPlayers(text).then(function(players) {
            $scope.battersLoading = false;
            return players;
        });
    };
    
    /**
     * redirect to the batter's page
     */
    $scope.batterSelected = function() {
        if ($scope.batterSelection && $scope.batterSelection.id){
            $location.path('/batter/' + $scope.batterSelection.id);
        }
    };
    
    /**
     * Search for players where the result is expected to be a pitcher
     */
    $scope.searchPitchers = function(text) {
        $scope.pitchersLoading = true;
        return playerService.searchPlayers(text).then(function(players) {
            $scope.pitchersLoading = false;
            return players;
        });
    };
    
    /**
     * Search for players where the result is expected to be a pitcher
     */
    $scope.pitcherSelected = function() {
        if ($scope.pitcherSelection && $scope.pitcherSelection.id){
            $location.path('/pitcher/' + $scope.pitcherSelection.id);
        }
    };

} ];