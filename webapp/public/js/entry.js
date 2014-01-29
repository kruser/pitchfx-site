/**
 * Sets up our AngularJS module
 */
var app = angular.module('pitchfx', [ 'ui.bootstrap', 'ngTouch', 'ngRoute', 'jmdobry.angular-cache' ]);
app.service('filtersService', services.filtersService);
app.service('playerService', services.playerService);
app.service('statsService', services.statsService);
app.service('pitchesService', services.pitchesService);
app.controller('searchController', controllers.searchController);
app.directive('rkBattingStats', directives.battingStats);
app.directive('rkFilters', directives.filters);
app.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/atbats', {
        meta : 'atbats',
        controller : controllers.battingStatsController,
        templateUrl : '/partials/atbats.html',
    }).when('/pitches', {
        meta : 'pitches',
        controller : controllers.pitchStatsController,
        templateUrl : '/partials/pitches.html',
    }).when('/scouting', {
        meta : 'scouting',
        templateUrl : '/partials/scouting.html',
    }).otherwise({
        redirectTo : '/atbats'
    });
} ]);