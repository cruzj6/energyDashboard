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
    var filestream = nodeRequire('fs');
    var vm = this;

    // Remove selected file from DOM
    vm.removeFile = function () {
      delete vm.file;
    };

    // Upload file
    vm.loadFile = function () {
      if (vm.file) {
        vm.isFileUploading = true;
        vm.isNoFileError = false;
        var filePath = vm.file.path;
        // Read file data from path and base64 encode
        filestream.readFile(filePath, 'base64', function (err, data) {
          var parsedData = Parser.parseExcel(data);
          // Store data in local storage for cache
          $window.localStorage.setItem('lastSaved', JSON.stringify(parsedData));
          vm.removeFile();
          energyDatabaseService.updateData(parsedData).then(function () {
            vm.isFileUploading = false;
          });
        });
      } else {
        vm.isNoFileError = true;
        $timeout(function () { vm.isNoFileError = false; }, 5000);
      }
    };


  });
