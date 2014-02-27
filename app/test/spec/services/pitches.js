'use strict';

describe('Service: Pitches', function () {

  // load the service's module
  beforeEach(module('pitchfxApp'));

  // instantiate service
  var Pitches;
  beforeEach(inject(function (_Pitches_) {
    Pitches = _Pitches_;
  }));

  it('should do something', function () {
    expect(!!Pitches).toBe(true);
  });

});
