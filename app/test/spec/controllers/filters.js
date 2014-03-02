'use strict';

describe('Controller: FiltersCtrl', function() {

    // load the controller's module
    beforeEach(module('pitchfxApp'));

    var FiltersCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        FiltersCtrl = $controller('FiltersCtrl', {
            $scope: scope
        });
    }));

    it('Test the initial filter', function() {
        var filters = scope.filters;
        expect(filters).toBeTruthy();
        
        /* default starting date should be 1st of some year */
        expect(moment(filters.date.start).dayOfYear()).toBe(1);
        
        /* default end date should be today */
        expect(filters.date.end).toBe(moment().format('YYYY-MM-DD'));
        
        /* only look at regular season games by default */
        expect(filters.gameType.R).toBe(true);
        expect(Object.keys(filters.gameType).length).toBe(1);
    });
});
