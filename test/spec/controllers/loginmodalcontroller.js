'use strict';

describe('Controller: LoginModalCtrl', function () {

  // load the controller's module
  beforeEach(module('energydashApp'));

  var LoginCtrl,
    scope, edbCntrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, energyDatabaseService) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    edbCntrl = energyDatabaseService;

  }));

  it('should not create user if passwords dont match', function () {
    var errorTest;
    LoginCtrl.createUser("notAnEmail@email.com", 'pass1', 'pass2', 555).then(function(){},
      function(error)
      {
        errorTest = error;
        expect(error);
        expect(LoginCtrl.notMatchPass).toBe(true);
      }
    );

    edbCntrl.logUserIn("notAnEmail@email.com", 'pass1', function(success){
      expect(success).toBe(false);
    });

  });
});
