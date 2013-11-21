/**
 * Sets up our AngularJS module
 */
var app = angular.module('pitchfx', [ 'ui.bootstrap', 'ngTouch' ]);
app.service('playerService', services.playerService);
app.controller('searchController', controllers.searchController);
app.directive('rkBattingStats', directives.battingStats);