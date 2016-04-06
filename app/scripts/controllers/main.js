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
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    this.doNodeStuff = function () {
      var filestream = nodeRequire('fs'),
          filePath = $('#fileIo')[0].files[0].path;
      console.log(filePath);
      filestream.readFile(filePath, 'utf8', function (err, data) {
        console.log(data);
      });
    };

  });
