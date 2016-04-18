'use strict';

/**
 * @ngdoc service
 * @name energydashApp.buildingInfoService
 * @description
 * # buildingInfoService
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('buildingInfoService', function ($window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var fs = window.nodeRequire("fs");
    var self = this;

    //Get building data from file
    if(__dirname) {
      var path = __dirname + '/buildingMapData.json';
      var buildingData = fs.readFileSync(path, 'utf8');
      self.buildings = JSON.parse(buildingData).buildings;
    }

    return{
      getBuildingInfo: function(){
        return self.buildings;
      }
    }
  });
