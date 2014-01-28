var services = services || {};

/**
 * A service where the filters object will be updated, allowing anybody to put a
 * watcher on it and do some things.
 */
services.filtersService = [ '$log', function($log) {
    "use strict";

    this.filters = {};

} ];