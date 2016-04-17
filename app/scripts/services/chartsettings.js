'use strict';

/**
 * @ngdoc service
 * @name energydashApp.chartSettings
 * @description
 * # chartSettings
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('chartSettings', function ($window) {
    var key = 'chartSettings',
        settings = $window.localStorage.getItem(key) ? JSON.parse($window.localStorage.getItem('chartSettings')) : {
      dataBy: 'total'
    };

    return {
      // Setter
      save: function (attr, value) {
        // Change settings attribute
        settings[attr] = value;
        // Save to localStorage
        $window.localStorage.setItem(key, JSON.stringify(settings));
      },
      // Getter
      load: function () {
        return settings;
      }
    }

  });
