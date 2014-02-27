'use strict';

describe('Service: Stats', function() {

    // load the service's module
    beforeEach(module('pitchfxApp'));

    // instantiate service
    var Stats;
    beforeEach(inject(function(_Stats_) {
        Stats = _Stats_;
    }));

    it('should do something', function() {
        expect( !! Stats).toBe(true);
    });

});
