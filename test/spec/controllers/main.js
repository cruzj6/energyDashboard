'use strict';
describe('Controller: MainCtrl', function () {


  // load the controller's module
  beforeEach(module('energydashApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $window) {
    scope = $rootScope.$new();

    //Set up nodeRequire
    window.nodeRequire = window.top.require;
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
  });
});
