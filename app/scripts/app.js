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
    'nvd3',
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
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
