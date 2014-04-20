'use strict';

/**
 * A controller for rosters
 */
angular.module('pitchfxApp').controller('RosterCtrl', ['$scope', 'Team', function ($scope, teamService) {
	/**
     * All teams and their displays are hard-coded here
     */
      $scope.teams = [{ name: 'ARI', display: 'Arizona'},
					{ name: 'ATL', display: 'Atlanta'},
					{ name: 'BAL', display: 'Baltimore'},
					{ name: 'BOS', display: 'Boston'},
					{ name: 'CHC', display: 'Chicago (NL)'},
					{ name: 'CIN', display: 'Cincinnati'},
					{ name: 'CLE', display: 'Cleveland'},
					{ name: 'COL', display: 'Colorado'},
					{ name: 'CWS', display: 'Chicago (AL)'},
					{ name: 'DET', display: 'Detroit'},
					{ name: 'HOU', display: 'Houston'},
					{ name: 'KC', display: 'Kansas City'},
					{ name: 'LAA', display: 'Los Angeles (AL)'},
					{ name: 'LAD', display: 'Los Angeles (NL)'},
					{ name: 'MIA', display: 'Miami'},
					{ name: 'MIL', display: 'Milwaukee'},
					{ name: 'MIN', display: 'Minnesota'},
					{ name: 'NYM', display: 'New York (NL)'},
					{ name: 'NYY', display: 'New York (AL)'},
					{ name: 'OAK', display: 'Oakland'},
					{ name: 'PHI', display: 'Philadelphia'},
					{ name: 'PIT', display: 'Pittsburgh'},
					{ name: 'SD', display: 'San Diego'},
					{ name: 'SEA', display: 'Seattle'},
					{ name: 'SF', display: 'San Francisco'},
					{ name: 'STL', display: 'St. Louis'},
					{ name: 'TB', display: 'Tampa Bay'},
					{ name: 'TEX', display: 'Texas'},
					{ name: 'TOR', display: 'Toronto'},
					{ name: 'WSH', display: 'Washington'}];

    /**
	 * Get team's roster
	 */
	$scope.openTeam = function(team) {
		teamService.getRoster(team).then(function(result){
			$scope.currentRoster = result;
		});
	};
}]);
