'use strict';

describe('Directive: filterList', function () {

  // load the directive's module
  beforeEach(module('pitchfxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<filter-list></filter-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the filterList directive');
  }));
});
