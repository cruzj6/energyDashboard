'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('SettingsCtrl', function ($timeout, $window, chartSettings, Parser, energyDatabaseService) {
    var filestream = nodeRequire('fs'),
        vm = this;

    vm.users = [];

    energyDatabaseService.getDataByPath('users').then(function (data) {
      var userNode;
      for (userNode in data) {
        vm.users.push(data[userNode].email);
      }
    });

    // Load current setting
    vm.graphSettings = { donut: chartSettings.load().dataBy };

    // Save changes on radio change
    vm.saveChartSettings = function () {
      chartSettings.save('dataBy', vm.graphSettings.donut);
    };

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
