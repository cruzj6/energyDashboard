'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('MainCtrl', function () {
    // This is from when I was fucking around earlier
    this.doNodeStuff = function () {
      var filestream = nodeRequire('fs'),
          filePath = $('#fileIo')[0].files[0].path;
      console.log(filePath);
      filestream.readFile(filePath, 'utf8', function (err, data) {
        console.log(data);
      });
    };

  });
