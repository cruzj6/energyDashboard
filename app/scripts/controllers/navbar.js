'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.isActiveRoute = function (route) {
      return new RegExp(route).test($location.path());
    };
  });
