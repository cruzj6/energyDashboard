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
    'rwdImageMaps',
    'ui.bootstrap',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/witenergymap', {
        templateUrl: 'views/witenergymap.html',
        controller: 'WitenergymapCtrl',
        controllerAs: 'witenergymap'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
