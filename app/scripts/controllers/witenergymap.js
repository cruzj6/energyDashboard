'use strict';

/**
 * @ngdoc function
 * @name energydashApp.controller:WitenergymapCtrl
 * @description
 * # WitenergymapCtrl
 * Controller of the energydashApp
 *
 */

const sqftAvg = 14.3;
var fs = window.nodeRequire("fs");
angular.module('energydashApp')
  .controller('WitenergymapCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //TODO: get path from app
    var path = '/users/joey/witenergy/app/buildingMapData.json';
    var buildingData = fs.readFileSync(path, 'utf8');
    console.log("Got building data: " + buildingData);

    //Turn it to json
    this.buildings = JSON.parse(buildingData).buildings;

    //Click on building
    this.buildingClick = function(event, name)
    {
      event.preventDefault();
    };

    //Initialize the controller
    init(this);
  });

function init(cntrl) {

  //First init the energy usage for each building object
  for(var i=0; i<cntrl.buildings.length; i++)
  {
    var curBuild = cntrl.buildings[i];
    curBuild.energyUse = PHGetEnergyForBuilding(curBuild.id);
  }

  //Now draw the map
  drawMap(cntrl);
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
  map.src = "../app/witmap.jpg";
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
    var color = getColorForEnergy(PHGetEnergyForBuilding(buildingid), buildingid, buildings);

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

function PHGetEnergyForBuilding(id)
{
  var energyNum = sqftAvg * 39636;

  return energyNum;
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
  r = parseInt(percent * 255);
  g = parseInt(255 - (percent * 255));
  b = 0;

  console.log(r + "r" + g + "g" + b + "b");

  return "rgba(" + r + "," + g + "," + b + ",0.75)";
}
