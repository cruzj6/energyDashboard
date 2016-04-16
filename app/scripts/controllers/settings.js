'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('SettingsCtrl', function ($window, Parser, energyDatabaseService) {
    var filestream = nodeRequire('fs');
    var vm = this;

    vm.loadFile = function () {
      var filePath = vm.file.path;
      filestream.readFile(filePath, 'base64', function (err, data) {
        var parsedData = Parser.parseExcel(data);
        $window.localStorage.setItem('lastSaved', JSON.stringify(parsedData));
        console.log(parsedData);
        energyDatabaseService.updateData(parsedData).then(function () {
        });
      });
    };


  });
