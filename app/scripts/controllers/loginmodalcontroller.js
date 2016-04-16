'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:LoginmodalcontrollerCtrl
 * @description
 * # LoginmodalcontrollerCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('LoginModalCtrl', function ($scope, $rootScope, $uibModal, energyDatabaseService) {

    var self = this;
    self.mode = 'login';
    self.logIn = function(user, pass)
    {
      self.mode = 'loading';
      if(user && pass) {
        //Log the user in
        energyDatabaseService.logUserIn(user, pass, function (success) {
          //If the login is a success
          if (success) $rootScope.$broadcast('login', {});
          else openWarnModal("Incorrect Email or Password");
        });
      }
      else{//If the user has not entered both username and password
        self.mode = 'login';
        openWarnModal("Please Enter both Username and Password");
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

    self.createAccount = function()
    {
      self.notMatchPass = false;
      self.mode = 'create';
    };

    self.loginMode = function()
    {
      self.mode = 'login';
    };

    self.createUser = function(user, pass, repass)
    {
      if(pass != repass)
      {
        openWarnModal("Passwords do not match");
        self.mode = 'create';
        self.notMatchPass = true;
      }
      else if(!pass || !user || !repass)
      {
        openWarnModal("Please fill out all fields");
      }
      else{
        self.mode = 'loading';
        energyDatabaseService.addUser(user, pass, function(success, err)
        {
          if(success)
          {
            //If success log them in
            energyDatabaseService.logUserIn(user, pass, function(s)
            {
              if(s) $rootScope.$broadcast('login', {});
            });
          }
          else{
            if(err) openWarnModal(err);
            $scope.$apply(function() {self.mode = 'create'});
          }
        });
      }
    };

    function openWarnModal(msg)
    {
      $uibModal.open({
        template: "<div class='modal-body'>" + msg + "</div>"
      });
    }

  });
