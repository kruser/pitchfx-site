/**
 * Sets up our AngularJS module
 */
goog.provide('kruser.Entry');

goog.require('kruser.controllers.searchController');
goog.require('kruser.services.playerService');

var moduleName = 'kruser.Entry';
var module = angular.module(moduleName, [ 'ui.bootstrap' ]);

module.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider.when('/batter/:playerId', {
				templateUrl : 'partials/kruser/batters/batter.html'
			}).when('/pitcher/:playerId', {
				templateUrl : 'partials/kruser/pitchers/pitcher.html'
			}).otherwise({
				templateUrl : 'partials/kruser/marketing/home.html',
				controller : kruser.controllers.searchController
			});

			$locationProvider.html5Mode(true).hashPrefix('!');
		} ]);

module.service('playerService', kruser.services.playerService);

angular.bootstrap(document, [ moduleName ]);