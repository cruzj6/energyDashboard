'use strict';

/**
 * @ngdoc directive
 * @name energydashApp.directive:mappopup
 * @description
 * # mappopup
 */
angular.module('energydashApp')
  .directive('mappopup', function () {
    return {
      link: function(scope, element, attrs) {
        var coords = attrs.coords.split(',');
        var xycoords = [];
        var buildingInfo = scope.build;

        console.log(JSON.stringify(coords));

        //Build xy coords
        for(var i=0; i < coords.length; i++)
        {
          xycoords.push({
            x: Number(coords[i]),
            y: Number(coords[++i])
          })
        }

        console.log("FULL XY COORDS: " + JSON.stringify(xycoords));

        //Defaults
        var leftx = 9999;
        var rightx = -1;
        var topy = 9999;
        var boty = -1;

        //Get edges for the box
        for(var j=0; j < xycoords.length; j++)
        {
          var curCoords = xycoords[j];

          console.log("Cur Coords: " + JSON.stringify(curCoords));
          if(curCoords.x > rightx)
          {
            rightx = curCoords.x;
            console.log("Set rightx: " + rightx);

          }
          if(curCoords.x < leftx)
          {
            leftx = curCoords.x;
            console.log("Set leftx: " + leftx);

          }

          //Y Coords top left is 0,0 bottom right is 100%, 100%
          if(curCoords.y > boty)
          {
            boty = curCoords.y;
            console.log("Set boty: " + boty);
          }

          if(curCoords.y < topy)
          {
            topy = curCoords.y;
            console.log("Set topy: " + topy);

          }
        }

        //Push new building box info to array and
        //build data for box and it's popover
        scope.$parent.buildingBoxes.push({
            //This will bind the angular buildingInfo from the image map to
            //this item, so we can just update that
            buildingInfo: buildingInfo,
            left: leftx,
            right: rightx,
            top: topy,
            bot: boty
          }
        );

        console.log("BUILDING BOXES: " + JSON.stringify(scope.$parent.buildingBoxes));
      }
    };
  });
