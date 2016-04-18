'use strict';

describe('Directive: loginModal', function () {

  // load the directive's module
  beforeEach(module('energydashApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<login-modal></login-modal>');
    element = $compile(element)(scope);
  }));
});
