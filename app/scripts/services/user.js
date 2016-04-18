'use strict';

/**
 * @ngdoc service
 * @name energydashApp.User
 * @description
 * # User
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('User', function ($rootScope, energyDatabaseService) {

    var email;
    $rootScope.$on('login', function(event, args)
    {
      var uid = energyDatabaseService.getUserAuthData().uid;
      energyDatabaseService.getUserEmail(uid, function(data)
      {
        email = data;
      });
    });

    return {
      getEmail: function () {
        return email;
      }
    };

  });
