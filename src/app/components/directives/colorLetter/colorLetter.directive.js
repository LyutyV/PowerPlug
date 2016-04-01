(function() {
  'use strict';

  angular
    .module('powerPlug')
    .directive('colorLetter', function(jsonLoader) {
      return {
        // scope: {
        //   letter: '='
        // },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A',
        link: function($scope, iElm, iAttrs) {
          var filename = 'directives/colorLetter/colorsMap.json';
          $scope.onReadyLoadColors = function(colorsMap) {
            $scope.colorsMap = colorsMap;

            switch (iAttrs.colorLetter) {
              case "A":
                iElm.css({
                  'color': $scope.colorsMap.A
                })
                iElm.html(iAttrs.colorLetter);
                break;
              case "B":
                iElm.css({
                  'color': $scope.colorsMap.B
                })
                iElm.html(iAttrs.colorLetter);
                break;
              case "C":
                iElm.css({
                  'color': $scope.colorsMap.C
                })
                iElm.html(iAttrs.colorLetter);
                break;
              case "D":
                iElm.css({
                  'color': $scope.colorsMap.D
                })
                iElm.html(iAttrs.colorLetter);
                break;
              case "E":
                iElm.css({
                  'color': $scope.colorsMap.E
                })
                iElm.html(iAttrs.colorLetter);
                break;
              case "F":
                iElm.css({
                  'color': $scope.colorsMap.F
                })
                iElm.html(iAttrs.colorLetter);
                break;
            }

          }
          jsonLoader.getJSON($scope.onReadyLoadColors, null, filename);

        }
      };

    })
})()
