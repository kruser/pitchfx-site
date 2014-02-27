'use strict';

describe('Service: Charting', function() {

    // load the service's module
    beforeEach(module('pitchfxApp'));

    // instantiate service
    var Charting;
    beforeEach(inject(function(_Charting_) {
        Charting = _Charting_;
    }));

    it('should do something', function() {
        expect( !! Charting).toBe(true);
    });

});
