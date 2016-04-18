'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:WitenergymapCtrl
 * @description
 * # WitenergymapCtrl
 * Controller of the energydashApp
 *
 */

angular.module('energydashApp')
  .controller('WitenergymapCtrl', function ($scope, energyDatabaseService, $uibModal, buildingInfoService) {
    //var fs = window.nodeRequire("fs");

    var self = this;
    self.sqftAvg = 3;
    self.lowestEnergy = 0;
    self.highestEnergy = 0;
    self.powerPlantEnabled = false;
    self.loading = false;

    //Get building data from file
    //var path = __dirname + '/buildingMapData.json';
    //var buildingData = fs.readFileSync(path, 'utf8');
   // self.buildings = JSON.parse(buildingData).buildings;

    //Get building info from service
    self.buildings = buildingInfoService.getBuildingInfo();

    //Click on building image map area
    self.buildingClick = function(event, name)
    {
      //No page refresh
      event.preventDefault();
    };

    //When the curEnergyData is changed we need to change everything
    $scope.$watch(function(){return self.curEnergyData}, function(v){refreshBuildingAndMap(v)});

    self.powerPlantCheck = function(isEnabled){
      //ReDraw the map
      refreshBuildingAndMap({});
    };

    //Initialize the controller
    init(self, energyDatabaseService);
    function init(cntrl, energyDatabaseService) {

      //Initialize the energy data for the scope, after login
      updateScopeEnergyData(cntrl, energyDatabaseService);
    }

    function refreshBuildingAndMap(v)
    {
      self.loading = true;
        if(self.curEnergyData) {
          //Update buildings data to current latest
          updateLatestForBuildings(self);

          //Re-draw the map
          drawMap(self);
        }
      self.loading = false;
    }

    function updateScopeEnergyData(cntrl, energyDatabaseService)
    {
      //Get most recent energy datas
      energyDatabaseService.getDataByPath('perDate').then(function (data) {

        console.log(JSON.stringify(data));
        var newestDateData = {date: 0};

        //Now Get the latest
        for(var key in data)
        {
          var curData = data[key];

          if(new Date(curData.date).getTime() > new Date(newestDateData.date).getTime())
          {
            newestDateData = curData;
          }
        }

        console.log(JSON.stringify(newestDateData));
        cntrl.curEnergyData = newestDateData.values;
      });
    }

    function updateLatestForBuildings(cntrl)
    {
      //First init the energy usage for each building object
      for(var i=0; i<cntrl.buildings.length; i++)
      {
        var curBuild = cntrl.buildings[i];

        //Check if it is power plant and if power plant is enabled
        //0 will be most recent
        for(var j=0; j< cntrl.curEnergyData.length; j++)
        {
          if(window.btoa(cntrl.curEnergyData[j].name) === curBuild.id)
          {
            curBuild.energyUse = cntrl.curEnergyData[j].val;
          }
        }

      }

      //Get new energy minimum and maximum
      var minMax = computeEnergyMinMax(cntrl.buildings);
      self.lowestEnergy = minMax.min;
      self.highestEnergy = minMax.max;
    }

    function drawCanvasImage(mapCanvas)
    {
      /*var mapCanvas = document.getElementById('mapCanvas');

      //Scale the canvas to it's parent
      mapCanvas.style.width="100%";
      mapCanvas.style.height="100%";*/

      var mapImgLink = mapCanvas.toDataURL();
      var mapImg = document.getElementById('mapImage');
      mapImg.src = mapImgLink;

      mapCanvas.style.display = 'none';
    }

    function drawMap(cntrl)
    {
      //var mapCanvas = document.getElementById('mapCanvas');
      //mapCanvas.style.display = '';

      //Canvas we will draw the map on
      //var stage = new createjs.Stage("mapCanvas");

      var canvas = document.createElement('canvas');
      canvas.id = 'mapCanvas';
      canvas.width="1586";
      canvas.height="975";
      var stage = new createjs.Stage(canvas);

      //Create map bitmap
      var map = new Image();
      map.src = "images/witmap.jpg";
      var bitmap = new createjs.Bitmap(map);
      stage.addChild(bitmap);

      //Once it is done loading, update the canvas
      bitmap.image.onload = function() {
        stage.update();
        drawCanvasImage(canvas);
      };

      //Assign buildings object
      var buildings = cntrl.buildings;

      //Loop through for each building
      for(var i=0; i < buildings.length; i++)
      {
        //Get our data from the buildings JSON
        var buildingCoords = buildings[i].polycoords.split(',');
        var buildingid = buildings[i].id;
        var polygon = new createjs.Shape();

        //TODO: Placeholder energy getter, this will be from service later and colors
        var color = getColorForEnergy(getLatestBuildingEnergyData(cntrl, buildingid), buildingid, buildings);

        //Begin drawing over the map, start with the fill
        polygon.graphics.beginFill(color);
        var curPoint = polygon.graphics.moveTo(buildingCoords[0], buildingCoords[1]);

        //Draw each line to line point
        for(var j=2; j < buildingCoords.length; j++) {

          //Next point
          curPoint = curPoint.lineTo(buildingCoords[j], buildingCoords[++j]);
        }

        //Close it off, back to start
        curPoint.lineTo(buildingCoords[0], buildingCoords[1]);

        //Now draw the border of thebuilding
        polygon.graphics.setStrokeStyle(3).beginStroke("white");

        //Initial start point
        var currPoint = polygon.graphics.moveTo(buildingCoords[0], buildingCoords[1]);

        //Draw each line
        for(var k=2; k < buildingCoords.length; k++) {

          //Next point
          currPoint = curPoint.lineTo(buildingCoords[k], buildingCoords[++k]);
        }

        //Close it off, back to start
        currPoint.lineTo(buildingCoords[0], buildingCoords[1]);

        //Add it to the stage and update the canvas
        stage.addChild(polygon);
        stage.update();
      }
    }

    function getLatestBuildingEnergyData(cntrl, id)
    {
      var energyData = cntrl.curEnergyData;
      for(var i=0; i < energyData.length; i++)
      {
        var curBuilding = energyData[i];
        if(window.btoa(curBuilding.name) === id)
        {
          return curBuilding.val;
        }
      }

      //Missing building
      return -1;
    }
    // 14.3 per square foot as average
    function getColorForEnergy(energyNumber, buildingId, buildings)
    {
      var buildingInfo = {};

      //Get the correct building
      for(var i=0; i<buildings.length; i++)
      {
        if(buildings[i].id === buildingId)
        {
          buildingInfo = buildings[i];
          break;
        }
      }

      //Calculate energy usage per sqft
      var energyPerSqft = energyNumber / buildingInfo.sqft;

      var r;
      var g;
      var b;

      //floor of zero energy usage ceiling of double the average
      var floor = self.lowestEnergy;
      var ceil = self.highestEnergy;

      console.log("Floor: " + floor + " Ceil: " + ceil);

      //Green to red
      var percent = energyPerSqft/(ceil - floor);

      //Scale RBG with percentage of the ceiling
      r = parseInt(percent * 255);
      g = parseInt(255 - (percent * 255));
      b = 0;


      return "rgba(" + r + "," + g + "," + b + ",0.75)";
    }

    function computeEnergyMinMax(buildingsData)
    {
      //Min max per sqft
      var minMax = {
        min: 9999,
        max: 0
      };

      //Check through each building
      for(var i=0; i < buildingsData.length; i++)
      {
        var curBuild = buildingsData[i];

        //See if we are including power plant on scale
        if(curBuild.id != 'QjAxIC0gRSBNZXRlciA1MTA4MTQ5ICg3LjIp' || self.powerPlantEnabled) {
          var curBuildPerSqft = curBuild.energyUse / curBuild.sqft;
          if (curBuildPerSqft > minMax.max) {
            minMax.max = curBuildPerSqft;
          }
          if (curBuild.energyUse < minMax.min) {
            minMax.min = curBuildPerSqft;
          }
        }
      }

      return minMax;
    }

  });

