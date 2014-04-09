'use strict';

angular.module('pitchfxApp').service('Filters', [ '$timeout', '$angularCacheFactory', function($timeout, $angularCacheFactory)
{
    var filterCache = $angularCacheFactory('pinnedFilters', {
        capacity : 100,
        storageMode : 'localStorage',
    });

    this.filters = {};
    this.pinnedFilters = [];

    /**
     * reloads all saved filters from storage
     */
    this.reloadSavedFilters = function()
    {
        this.pinnedFilters = [];
        var filterNames = filterCache.keys(), key;
        for (key in filterNames)
        {
            this.pinnedFilters.push(filterCache.get(key));
        }
    };

    /**
     * Pins a new filter. This is different than saveActiveFilter as it is done
     * on purpose.
     */
    this.pinFilter = function(filterName, filter)
    {
        var self = this;
        $timeout(function()
        {
            filter.name = filterName;
            filterCache.put(filterName, filter);
            self.reloadSavedFilters();
        });
    };

} ]);
