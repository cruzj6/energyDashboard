'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('AdminCtrl', function ($scope, energyDatabaseService, $uibModal, $templateCache, $location, $rootScope) {

    var self = this;

    //Check if user is signed in
    var userAuthData = energyDatabaseService.getUserAuthData();
    if(userAuthData)
    {

    }
    else
    {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/loginmodal.html',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'modalCenter',
        controller: 'LoginModalCtrl',
        controllerAs: 'loginCtrl'
      });
    }

    //Close modal if login cancel event occurs
    $scope.$on('logincancel', function(event, args)
    {
      modalInstance.close();
      $location.path('/dashboard');
    });

    $scope.$on('login', function(event, args){
      modalInstance.close()
    });


  });
