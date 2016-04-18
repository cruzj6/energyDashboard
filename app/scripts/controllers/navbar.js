'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('NavbarCtrl', function ($scope, $location, energyDatabaseService, $uibModal, User) {
    $scope.isActiveRoute = function (route) {
      return new RegExp(route).test($location.path());
    };

    $scope.isLoggedIn = function()
    {
      return energyDatabaseService.getUserSignedIn();
    };

    $scope.$on('login', function(event, args)
    {
      var uid = energyDatabaseService.getUserAuthData().uid;
      energyDatabaseService.getUserEmail(uid, function(data)
      {
        $scope.userEmail = data;
      });
    });

    $scope.logInClick = function()
    {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/loginmodal.html',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'modalCenter',
        controller: 'LoginModalCtrl',
        controllerAs: 'loginCtrl'
      });

      $scope.$on('logincancel', function(event, args)
      {
        modalInstance.close();
      });

      $scope.$on('login', function(event, args)
      {
        modalInstance.close();
      })
    };


  });
