'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:WitenergymapCtrl
 * @description
 * # WitenergymapCtrl
 * Controller of the energydashApp
 *
 */
const sqftAvg = 3;
var fs = window.nodeRequire("fs");
angular.module('energydashApp')
  .controller('WitenergymapCtrl', function ($scope, energyDatabaseService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var self = this;
    self.sqftAvg = sqftAvg;

    //Get building data from file
    var path = __dirname + '/buildingMapData.json';
    var buildingData = fs.readFileSync(path, 'utf8');
    console.log("Got building data: " + buildingData);
    self.buildings = JSON.parse(buildingData).buildings;

    //Click on building image map area
    self.buildingClick = function(event, name)
    {
      //No page refresh
      event.preventDefault();
    };

    //When the curEnergyData is changed we need to change everything
    $scope.$watch(function(){return self.curEnergyData}, function(val)
    {
      if(self.curEnergyData) {
        //Update buildings data to current latest
        updateLatestForBuildings(self);

        //Re-draw the map
        drawMap(self);
      }
    });

    //Initialize the controller
    init(self, energyDatabaseService);

  });

function init(cntrl, energyDatabaseService) {

  //Initialize the energy data for the scope, after login
  //TODO: TEST CODE JOEY REMOVE
  energyDatabaseService.logUserIn("joeymc12321@gmail.com", "US4kb5r5EnMy8dn4", function(s)
  {
    if(s) {
      updateScopeEnergyData(cntrl, energyDatabaseService);
    }
  });
}

function updateScopeEnergyData(cntrl, energyDatabaseService)
{
  //Get 3 most recent energy datas
  energyDatabaseService.getEnergyData(3, function (data) {
    cntrl.curEnergyData = data;
  });
}

function updateLatestForBuildings(cntrl)
{
  //First init the energy usage for each building object
  for(var i=0; i<cntrl.buildings.length; i++)
  {
    var curBuild = cntrl.buildings[i];

    //0 will be most recent
    for(var j=0; j< cntrl.curEnergyData[0].length; j++)
    {
      if(cntrl.curEnergyData[0][j].buildingid === curBuild.id)
      {
        curBuild.energyUse = cntrl.curEnergyData[0][j].energy;
      }
    }
  }
}

function drawCanvasImage()
{
  var mapCanvas = document.getElementById('mapCanvas');

  //Scale the canvas to it's parent
  mapCanvas.style.width="100%";
  mapCanvas.style.height="100%";

  var mapImgLink = mapCanvas.toDataURL();
  var mapImg = document.getElementById('mapImage');
  mapImg.src = mapImgLink;

  mapCanvas.style.display = 'none';
}

function drawMap(cntrl)
{
  var mapCanvas = document.getElementById('mapCanvas');
  mapCanvas.style.display = '';

  //Canvas we will draw the map on
  var stage = new createjs.Stage("mapCanvas");

  //Create map bitmap
  var map = new Image();
  map.src = "images/witmap.jpg";
  var bitmap = new createjs.Bitmap(map);
  stage.addChild(bitmap);

  //Once it is done loading, update the canvas
  bitmap.image.onload = function() {
    stage.update();
    drawCanvasImage();
  };

  //Assign buildings object
  var buildings = cntrl.buildings;

  //Loop through for each building
  for(var i=0; i < buildings.length; i++)
  {
    //Get our data from the buildings JSON
    var buildingCoords = buildings[i].polycoords.split(',');
    console.log(JSON.stringify(buildingCoords));
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
  var energyData = cntrl.curEnergyData[0];
  for(var i=0; i < energyData.length; i++)
  {
      var curBuilding = energyData[i];
      if(curBuilding.buildingid === id)
      {
        return curBuilding.energy;
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
  var floor = 0;
  var ceil = 2 * sqftAvg;

  //Green to red
  var percent = energyPerSqft/ceil;
  console.log(buildingInfo.name + " | " + energyPerSqft + "kwh/sqft | " + (percent * 100) + "% of average");

  //Scale RBG with percentage of the ceiling
  r = parseInt(percent * 255);
  g = parseInt(255 - (percent * 255));
  b = 0;

  console.log(r + "r" + g + "g" + b + "b");

  return "rgba(" + r + "," + g + "," + b + ",0.75)";
}
