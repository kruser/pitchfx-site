/**
 * Sets up our AngularJS module
 */
var app = angular.module('pitchfx', [ 'ui.bootstrap', 'ngTouch' ]);
app.controller('searchController', controllers.searchController);
app.service('playerService', services.playerService);


app.directive('kruserPlayerStats', directives.playerStats);