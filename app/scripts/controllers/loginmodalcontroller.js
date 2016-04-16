'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:LoginmodalcontrollerCtrl
 * @description
 * # LoginmodalcontrollerCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('LoginmodalcontrollerCtrl', function ($rootScope, $uibModal, energyDatabaseService) {

    var self = this;
    self.logIn = function(user, pass)
    {
      if(user && pass) {
        //Log the user in
        energyDatabaseService.logUserIn(user, pass, function (success) {
          //If the login is a success
          if (success) {
            $rootScope.$broadcast('login', {});
          }
          else {
            $uibModal.open({
              template: "<div class='modal-body'>Incorrect Username or Password</div>"
            });
          }
        });
      }
      else{//If the user has not entered both username and password
        if(!pass)
          self.isPassReq = true;
        if(!user)
          self.isUserReq = true;
      }

    };

    //If user cancels login
    self.cancelLogin = function()
    {
      $rootScope.$broadcast('logincancel', {});
    };

  });
