'use strict';

/**
 * @ngdoc service
 * @name energydashApp.User
 * @description
 * # User
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('User', function () {

    var firstName,
        lastName;

    // Hardcoded for now
    firstName = 'Bob';
    lastName = 'Johnson';

    return {
      getFirstName: function () {
        return firstName;
      },
      getLastName: function () {
        return lastName;
      }
    };

  });
