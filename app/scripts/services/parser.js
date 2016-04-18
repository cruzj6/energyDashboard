'use strict';

/**
 * @ngdoc service
 * @name energydashApp.Parser
 * @description
 * # Parser
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('Parser', function (buildingInfoService) {

    //Building local info from service
    self.buildings = buildingInfoService.getBuildingInfo();

    function parseSheet(sheet) {
      var i, splitLine,
        // Split up by lines
        dataLines = sheet.split('\n'),
        length = dataLines.length,
        dataPerBuilding = { name: '', unit: '', dates: {} };
      dataPerBuilding.name = dataLines[0].split(",")[1];
      dataPerBuilding.unit = dataLines[1].split(",")[1];
      for (i = 2; i < length; i += 1) {
        // Split up each line to grab values
        splitLine = dataLines[i].split(',');
        // Account for any errors in spacing with totals, maximums, and, minimums
        if (splitLine.indexOf('Maximum') !== -1 || splitLine.indexOf('Total') !== -1 || splitLine.indexOf('Minimum') !== -1 || splitLine.indexOf('Average') !== -1) {
          dataPerBuilding[splitLine[3].toLowerCase()] = Number(splitLine[4]);
        }
        // Make sure the line isn't blank
        if (splitLine[0]) {
          // Set the correct data for the date
          dataPerBuilding.dates[String(new Date(splitLine[0]))] = Number(splitLine[1]);
        }
      }
      return dataPerBuilding;
    }

    //Get building names for graph (If possible)
    function buildNameFromId(id)
    {
      for(var i=0; i < self.buildings.length; i++)
      {
        var curBuild = self.buildings[i];
        if(curBuild.id === id)
        {
          return curBuild.name;
        }
      }

      //We dont have the name
      return null;
    }

    return {
      parseExcel: function (data) {
        var i, parsedBuilding, date, encodedDate,
            buildingsObjMap = {},
            dateObjMap = {},
            workbook = XLSX.read(data, { type: 'base64' }),
            sheetsLength = workbook.SheetNames.length;
        // Go through each sheet, convert to raw CSV string and parse
        for (i = 0; i < sheetsLength; i += 1) {
          parsedBuilding = parseSheet(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[i]]));
          buildingsObjMap[window.btoa(parsedBuilding.name)] = parsedBuilding;
          for (date in parsedBuilding.dates) {
            encodedDate = window.btoa(date);
            dateObjMap[encodedDate] = dateObjMap[encodedDate] || { date: '', values: [] };
            dateObjMap[encodedDate].date = date;
            dateObjMap[encodedDate].values.push({ name: parsedBuilding.name, val: parsedBuilding.dates[date] })
          }
        }
        return { perDate: dateObjMap, perBuilding: buildingsObjMap };
      },
      charts: {
        donut: function (data, attr) {
          var building,
              parsedData = [];
          for (building in data) {
            var buildingId = window.btoa(data[building].name);
            var buildingName = buildNameFromId(buildingId);
            parsedData.push({ label: buildingName ? buildingName : data[building].name, value: data[building][attr.toLowerCase()]});
          }
          return parsedData;
        },
        line: function (data) {
          var building, date, series,
              parsedData = [];
          for (building in data) {
            var buildingId = window.btoa(data[building].name);
            var buildingName = buildNameFromId(buildingId);
            series = { key: buildingName ? buildingName : data[building].name, values: [] };
            for (date in data[building].dates) {
              series.values.push([ new Date(date).getTime(), data[building].dates[date] ]);
            }
            series.values.sort(function (a, b) {
              return a[0] - b[0];
            });
            parsedData.push(series);
          }
          return parsedData;
        }
      }
    };

  });
