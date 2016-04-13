'use strict';

describe('Directive: rwdImageMaps', function () {

  // load the directive's module
  beforeEach(module('energydashApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<rwd-image-maps></rwd-image-maps>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rwdImageMaps directive');
  }));
});
