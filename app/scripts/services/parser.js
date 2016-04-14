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
        if (splitLine[0]) {
          dataPerBuilding.dates[String(new Date(splitLine[0]))] = splitLine[1];
        }
      }
      return dataPerBuilding;
    }

    return {
      parse: function (data) {
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

      }
    };

  });
