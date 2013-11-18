/**
 * Sets up our AngularJS module
 */
var moduleName = 'Entry';
var module = angular.module(moduleName, [ 'ui.bootstrap', 'ngTouch' ]);

module.controller('searchController', controllers.searchController);
module.service('playerService', services.playerService);

angular.bootstrap(document, [ moduleName ]);