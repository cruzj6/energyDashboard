'use strict';

describe('Controller: LoginmodalcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('energydashApp'));

  var LoginmodalcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginmodalcontrollerCtrl = $controller('LoginmodalcontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LoginmodalcontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
