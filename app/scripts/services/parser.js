'use strict';

/**
 * @ngdoc service
 * @name energydashApp.Parser
 * @description
 * # Parser
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('Parser', function () {

    return {
      parse: function (data) {
        var i,
            dataLines = data.split("\n"),
            length = dataLines.length,
            returnedObj = { dates: [] };
        returnedObj.name = dataLines[0].split(",")[1];
        returnedObj.unit = dataLines[1].split(",")[1];
        for (i = 2; i < length; i += 1) {
          returnedObj.dates.push({
            date: dataLines[i].split(",")[0],
            val: dataLines[i].split(",")[1]
          });
        }
        return returnedObj;
      }
    }

  });
