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

    function parseSheet(sheet) {
      var i, splitLine,
        dataLines = sheet.split('\n'),
        length = dataLines.length,
        dataPerBuilding = { name: '', unit: '', dates: {} };
      dataPerBuilding.name = dataLines[0].split(",")[1];
      dataPerBuilding.unit = dataLines[1].split(",")[1];
      for (i = 2; i < length; i += 1) {
        splitLine = dataLines[i].split(',');
        if (splitLine.indexOf('Maximum') !== -1 || splitLine.indexOf('Total') !== -1 || splitLine.indexOf('Minimum') !== -1 || splitLine.indexOf('Average') !== -1) {
          dataPerBuilding[splitLine[3].toLowerCase()] = Number(splitLine[4]);
        }
        if (splitLine[0]) {
          dataPerBuilding.dates[String(new Date(splitLine[0]))] = Number(splitLine[1]);
        }
      }
      return dataPerBuilding;
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
            parsedData.push({ label: data[building].name, value: data[building][attr.toLowerCase()]});
          }
          return parsedData;
        },
        line: function (data) {
          var building, date, series,
              parsedData = [];
          for (building in data) {
            series = { key: data[building].name, values: [] };
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
