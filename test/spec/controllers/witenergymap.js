'use strict';

describe('Controller: WitenergymapCtrl', function () {

  // load the controller's module
  beforeEach(module('energydashApp'));

  var WitenergymapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WitenergymapCtrl = $controller('WitenergymapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
  });
});
