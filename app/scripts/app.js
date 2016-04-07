'use strict';

/**
 * @ngdoc overview
 * @name energydashApp
 * @description
 * # energydashApp
 *
 * Main module of the application.
 */
angular
  .module('energydashApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'nvd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
