'use strict';

/**
 * A controller for rosters
 */
angular.module('pitchfxApp')
  .controller('RosterCtrl', function ($scope) {
      $scope.teams = [{ team: 'ARI', display: 'Arizona'},
					{ team: 'ATL', display: 'Atlanta'},
					{ team: 'BAL', display: 'Baltimore'},
					{ team: 'BOS', display: 'Boston'},
					{ team: 'CHC', display: 'Chicago (NL)'},
					{ team: 'CIN', display: 'Cincinnati'},
					{ team: 'CLE', display: 'Cleveland'},
					{ team: 'COL', display: 'Colorado'},
					{ team: 'CWS', display: 'Chicago (AL)'},
					{ team: 'DET', display: 'Detroit'},
					{ team: 'HOU', display: 'Houston'},
					{ team: 'KC', display: 'Kansas City'},
					{ team: 'LAA', display: 'Los Angeles (AL)'},
					{ team: 'LAD', display: 'Los Angeles (NL)'},
					{ team: 'MIA', display: 'Miami'},
					{ team: 'MIL', display: 'Milwaukee'},
					{ team: 'MIN', display: 'Minnesota'},
					{ team: 'NYM', display: 'New York (NL)'},
					{ team: 'NYY', display: 'New York (AL)'},
					{ team: 'OAK', display: 'Oakland'},
					{ team: 'PHI', display: 'Philadelphia'},
					{ team: 'PIT', display: 'Pittsburgh'},
					{ team: 'SD', display: 'San Diego'},
					{ team: 'SEA', display: 'Seattle'},
					{ team: 'SF', display: 'San Francisco'},
					{ team: 'STL', display: 'St. Louis'},
					{ team: 'TB', display: 'Tampa Bay'},
					{ team: 'TEX', display: 'Texas'},
					{ team: 'TOR', display: 'Toronto'},
					{ team: 'WSH', display: 'Washington'}];
    });
