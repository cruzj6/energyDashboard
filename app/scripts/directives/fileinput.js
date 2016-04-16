'use strict';

/**
 * @ngdoc directive
 * @name energydashApp.directive:fileInput
 * @description
 * # fileInput
 */
angular.module('energydashApp')
  .directive('fileInput', function () {
    return {
      template: '<div class="file-input-control"><input type="file" id="{{ uid }}" accept=".xlsx" class="hidden" /><label for="{{ uid }}" class="btn btn-default"><i class="fa fa-file-excel-o"></i>&nbsp; Select File</label></div>',
      restrict: 'E',
      replace: true,
      scope: {
        uid: '@uid',
        file: '=file'
      },
      link: function postLink(scope, element) {
        element.on('change', function (event) {
          scope.$apply(function () {
            scope.file = event.target.files[0];
          });
        });
      }
    };
  });
