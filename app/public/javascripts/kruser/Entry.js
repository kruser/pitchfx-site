goog.provide('kruser.Entry');

var exports = kruser.Entry;

/**
 * Sets up THE master angular app for this web application. This here is real!
 */
(function(global)
{
    "use strict";

    var Entry = angular.isDefined(exports) ? exports : global.Entry =
    {};

    Entry.name = 'kruser.Entry';

    var module = angular.module(Entry.name, [ 'ngRoute' ]);

    module.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $routeProvider.when('/batter/:playerId',
        {
            templateUrl : 'partials/kruser/batters/batter.html'
        }).when('/pitcher/:playerId',
        {
            templateUrl : 'partials/kruser/pitchers/pitcher.html'
        }).otherwise(
        {
            templateUrl : 'partials/kruser/marketing/home.html'
        });
        
        $locationProvider.html5Mode(true).hashPrefix('!');
    } ]);

    angular.bootstrap(document, [ Entry.name ]);
    return module;

}(this));