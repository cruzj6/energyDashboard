'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('SettingsCtrl', function (Parser, energyDatabaseService) {
    var filestream = nodeRequire('fs');
    var vm = this;

    vm.loadFile = function () {
      var filePath = $('#fileIo')[0].files[0].path;
      filestream.readFile(filePath, 'base64', function (err, data) {
        var parsedData = Parser.parseExcel(data);
        console.log(parsedData);
        energyDatabaseService.updateData(parsedData).then(function () {
          console.log('Sweet it worked');
        });
      });
    };
  });
