/**
 * Sets up our AngularJS module
 */
goog.provide('kruser.Entry');

goog.require('kruser.controllers.searchController');
goog.require('kruser.services.playerService');
goog.require('kruser.directives.playerHeader');

var moduleName = 'kruser.Entry';
var module = angular.module(moduleName, [ 'ui.bootstrap', 'ngRoute', 'ngTouch' ]);

module.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider.when('/batter/:playerId', {
				templateUrl : 'partials/batter.html'
			}).when('/pitcher/:playerId', {
				templateUrl : 'partials/pitcher.html'
			}).otherwise({
				templateUrl : 'partials/home.html',
				controller : kruser.controllers.searchController
			});

			$locationProvider.html5Mode(false).hashPrefix('!');
		} ]);

module.service('playerService', kruser.services.playerService);

module.directive('kruserPlayerHeader', kruser.directives.playerHeader);

angular.bootstrap(document, [ moduleName ]);