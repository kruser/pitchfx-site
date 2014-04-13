'use strict';

angular.module('pitchfxApp').service('Filters', [ '$timeout', '$angularCacheFactory', '$log', function($timeout, $angularCacheFactory, $log)
{
    var filterCache = $angularCacheFactory('pinnedFilters', {
        capacity : 100,
        storageMode : 'localStorage',
    });

    this.filters = undefined;
    this.pinnedFilters = [];

    /**
     * reloads all saved filters from storage
     */
    this.reloadSavedFilters = function()
    {
        this.pinnedFilters = [];
        var filterNames = filterCache.keys(), key;
        $log.debug(filterNames);
        for (key in filterNames)
        {
            this.pinnedFilters.push(filterCache.get(filterNames[key]));
        }
    };

    /**
     * Set the active filter
     * 
     * @param {object}
     *            filter - the entire filter object to save
     */
    this.setActiveFilter = function(filter)
    {
        this.filters = filter;
    };

    /**
     * Pins a new filter. This is different than saveActiveFilter as it is done
     * on purpose.
     * 
     * @param {string}
     *            filterName - the name of the filter. This needs to be unique.
     *            If not unique it will overwrite the previous one
     * @param {object}
     *            filter - the entire filter object to save
     */
    this.pinFilter = function(filterName, filter)
    {
        var self = this;
        $timeout(function()
        {
            filter.name = filterName;
            filterCache.put(filterName + '_' + filter.playerCard, filter);
            self.reloadSavedFilters();
            _gaq.push([ '_trackEvent', 'filters', 'saved', filterName ]);
        });
    };

    /**
     * Remove a saved filter
     * 
     * @param {string}
     *            filterName - just the name (key) of the filter to delete
     */
    this.unpinFilter = function(filterName)
    {
        var self = this;
        $timeout(function()
        {
            filterCache.remove(filterName);
            self.reloadSavedFilters();
            _gaq.push([ '_trackEvent', 'filters', 'deleted', filterName ]);
        });
    };

    /**
     * @param {int}
     *            year - the year of the filter
     * @param {string}
     *            cardType - one of (batter|pitcher)
     */
    this.buildYearFilter = function(year, cardType)
    {
        var filter = {
            playerCard : cardType,
            pitcherHand : '',
            batterHand : '',
            name : year.toString(),
            date : {
                start : moment([ year, 0, 1 ]).format('YYYY-MM-DD'),
                end : moment([ year, 11, 31 ]).format('YYYY-MM-DD'),
            },
            runners : {
                gate : 'OR',
            },
            outs : {},
            balls : {},
            strikes : {},
            gameType : {
                R : true,
            }
        };
        return filter;
    };

    /**
     * Stage your pinned filters for the past three years. To be called in the
     * case you don't have any saved already.
     */
    this.setupPinnedFilters = function()
    {
        if (this.pinnedFilters.length === 0)
        {
            var currentYear = moment().year(), i, year;
            for (i = 0; i < 3; i++)
            {
                year = currentYear - i;
                filterCache.put(year.toString() + '_pitcher', this.buildYearFilter(year, 'pitcher'));
                filterCache.put(year.toString() + '_batter', this.buildYearFilter(year, 'batter'));
            }
            this.reloadSavedFilters();
        }
    };

    /**
     * set it up
     */
    this.init = function()
    {
        this.reloadSavedFilters();
        this.setupPinnedFilters();
    };

    this.init();

} ]);
