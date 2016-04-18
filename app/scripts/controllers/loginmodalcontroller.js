'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:LoginmodalcontrollerCtrl
 * @description
 * # LoginmodalcontrollerCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('LoginModalCtrl', function ($scope, $rootScope, $uibModal, energyDatabaseService, $q) {

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
          else {
            $scope.$apply(function () {
              self.mode = 'login'
            });
            openWarnModal("Incorrect Email or Password");
          }
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

    self.createUser = function(user, pass, repass, cd)
    {
      var defer = $q.defer();
      energyDatabaseService.adminVerify(cd, function(verified) {
        if (verified) {
          if (pass != repass) {
            openWarnModal("Passwords do not match");
            self.mode = 'create';
            self.notMatchPass = true;
            defer.reject('PasswordsDontMatch');
          }
          else if (!pass || !user || !repass) {
            openWarnModal("Please fill out all fields");
            defer.reject('Not all fields filled');
          }
          else {
            self.mode = 'loading';
            energyDatabaseService.addUser(user, pass, function (success, err) {
              if (success) {

                //If success log them in
                energyDatabaseService.logUserIn(user, pass, function (s) {
                  if (s) {
                    $rootScope.$broadcast('login', {})
                    defer.resolve();
                  }
                });
              }
              else {
                if (err) openWarnModal(err);
                $scope.$apply(function () {
                  self.mode = 'create'
                });

                defer.reject(err);
              }
            });
          }
        }
        else {
          openWarnModal("Incorrect Secret Code!");
        }
      });
      return defer.promise;
    };

    function openWarnModal(msg)
    {
      $uibModal.open({
        template: "<div class='modal-body'>" + msg + "</div>"
      });
    }

  });
