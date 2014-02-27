/**
 * Sets up our AngularJS module
 */
angular.module('pitchfxApp', ['ui.bootstrap', 'ngTouch', 'ngRoute', 'jmdobry.angular-cache']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/atbats', {
            meta: 'atbats',
            controller: 'BattingstatsCtrl',
            templateUrl: '/partials/atbats.html',
            reloadOnSearch: false,
        }).when('/pitches', {
            meta: 'pitches',
            controller: 'PitchstatsCtrl',
            templateUrl: '/partials/pitches.html',
            reloadOnSearch: false,
        }).when('/scouting', {
            meta: 'scouting',
            templateUrl: '/partials/scouting.html',
        }).when('/twitter', {
            meta: 'twitter',
            templateUrl: '/partials/twitter.html',
        }).otherwise({
            /* global document */
            redirectTo: document.body.getAttribute('data-default-route')
        });
    }
]);
