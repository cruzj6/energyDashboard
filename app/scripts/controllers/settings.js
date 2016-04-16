'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('SettingsCtrl', function ($timeout, $window, Parser, energyDatabaseService) {
    //var filestream = nodeRequire('fs');
    var vm = this;

    vm.removeFile = function () {
      delete vm.file;
    };

    vm.loadFile = function () {
      if (vm.file) {
        vm.isNoFileError = false;
        var filePath = vm.file.path;
        filestream.readFile(filePath, 'base64', function (err, data) {
          var parsedData = Parser.parseExcel(data);
          $window.localStorage.setItem('lastSaved', JSON.stringify(parsedData));
          vm.removeFile();
          energyDatabaseService.updateData(parsedData).then(function () {
            //
          });
        });
      } else {
        vm.isNoFileError = true;
        $timeout(function () { vm.isNoFileError = false; }, 5000);
      }
    };


  });
