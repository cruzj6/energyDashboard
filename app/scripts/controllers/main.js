'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('MainCtrl', function (Parser, energyDatabaseService) {

    var vm = this;

    energyDatabaseService.getDataByPath('perBuilding').then(function (data) {
      vm.donutData = Parser.charts.donut(data, 'total');
      console.log(vm.donutData);
    });

    vm.donutOptions = {
      chart: {
        type: 'pieChart',
        donut: true,
        height: 500,
        showLabels: false,
        showLegend: false,
        margin : {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        x: function (d) {
          return d.label;
        },
        y: function (d) {
          return d.value;
        },
        showValues: true,
        transitionDuration: 1000
      }
    };

    //this.data = [{
    //  key: "Cumulative Return",
    //  values: [
    //    { "label" : "A" , "value" : -29.765957771107 },
    //    { "label" : "B" , "value" : 0 },
    //    { "label" : "C" , "value" : 32.807804682612 },
    //    { "label" : "D" , "value" : 196.45946739256 },
    //    { "label" : "E" , "value" : 0.19434030906893 },
    //    { "label" : "F" , "value" : -98.079782601442 },
    //    { "label" : "G" , "value" : -13.925743130903 },
    //    { "label" : "H" , "value" : -5.1387322875705 }
    //  ]
    //}];

  });
