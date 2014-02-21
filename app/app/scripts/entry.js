/**
 * Sets up our AngularJS module
 */
var app = angular.module('pitchfx', [ 'ui.bootstrap', 'ngTouch', 'ngRoute', 'jmdobry.angular-cache' ]);
app.service('filtersService', services.filtersService);
app.service('playerService', services.playerService);
app.service('statsService', services.statsService);
app.service('pitchesService', services.pitchesService);
app.service('chartingService', services.chartingService);
app.service('styleService', services.styleService);
app.controller('searchController', controllers.searchController);
app.controller('sharingController', controllers.sharingController);
app.controller('sharingModalController', controllers.sharingModalController);
app.directive('rkBattingStats', directives.battingStats);
app.directive('rkFilters', directives.filters);
app.directive('defaultAvatar', directives.defaultAvatar);
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
    }).when('/twitter', {
        meta : 'twitter',
        templateUrl : '/partials/twitter.html',
    }).otherwise({
        redirectTo : '/atbats'
    });
} ]);