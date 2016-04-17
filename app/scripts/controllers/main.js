'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the energydashApp
 */
angular.module('energydashApp')
  .controller('MainCtrl', function ($window, $timeout, chartSettings, Parser, energyDatabaseService) {

    var vm = this,
        processEvents = nodeRequire('electron').ipcRenderer,
        isBeingResized = false;

    // Get data from server
    energyDatabaseService.getDataByPath('perBuilding').then(function (data) {
      // Load chart data
      vm.donutData = Parser.charts.donut(data, chartSettings.load().dataBy);
      vm.lineData = Parser.charts.line(data);
    }, function () {
      var cachedData = JSON.parse($window.localStorage.getItem(('lastSaved')));
      vm.donutData = Parser.charts.donut(cachedData, chartSettings.load().dataBy);
      vm.lineData = Parser.charts.line(cachedData);
    });

    // Redraw graphs when window is resized
    processEvents.on('resized', function () {
      if (!isBeingResized) {
        isBeingResized = true;
        console.log('redrawing');
        vm.lineApi.update();
        vm.donutApi.update();
        // When resizing is finished
        $timeout(function () {
          isBeingResized = false;
        }, 100);
      }
    });

    // Donut chart settings
    vm.donutOptions = {
      chart: {
        type: 'pieChart',
        donut: true,
        height: 500,
        showLabels: false,
        showLegend: false,
        margin : {
          top: -30,
          right: -30,
          bottom: -30,
          left: -30
        },
        x: function (d) {
          return d.label;
        },
        y: function (d) {
          return d.value;
        },
        showValues: true,
        transitionDuration: 1000
      },
      title: {
        enable: true,
        text: 'Energy Consumption Per Building'
      }
    };

    // Area line chart settings
    vm.lineOptions = {
      chart: {
        type: 'stackedAreaChart',
        height: 500,
        showLabels: false,
        showLegend: false,
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1];
        },
        useVoronoi: false,
        //clipEdge: true,
        duration: 1000,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function(d) {
            return d3.time.format('%x')(new Date(d))
          }
        },
        yAxis: {
          showMaxMin: false,
          tickFormat: function(d){
            return d;
          }
        },
        zoom: {
          enabled: true,
          scaleExtent: [1, 10],
          useFixedDomain: false,
          useNiceScale: false,
          horizontalOff: false,
          verticalOff: true,
          unzoomEventType: 'dblclick.zoom'
        }
      },
      title: {
        enable: true,
        text: 'Energy Consumption Over Time'
      }
    }

  });
