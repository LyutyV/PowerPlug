(function() {
  'use strict';

 angular
   .module('powerPlug')
    .directive('colorLetter', function(jsonLoader) {
      return {
        restrict: 'A',
        link: function($scope, iElm, iAttrs) {
          $scope.onReadyLoadColors = function(colorsMap) {
            $scope.colorsMap = colorsMap;

            switch (iAttrs.colorLetter) {
              case "A":
                iElm.css({
                  'color': $scope.colorsMap.A
                });
                iElm.html(iAttrs.colorLetter);
                break;
              case "B":
                iElm.css({
                  'color': $scope.colorsMap.B
                });
                iElm.html(iAttrs.colorLetter);
                break;
              case "C":
                iElm.css({
                  'color': $scope.colorsMap.C
                });
                iElm.html(iAttrs.colorLetter);
                break;
              case "D":
                iElm.css({
                  'color': $scope.colorsMap.D
                });
                iElm.html(iAttrs.colorLetter);
                break;
              case "E":
                iElm.css({
                  'color': $scope.colorsMap.E
                });
                iElm.html(iAttrs.colorLetter);
                break;
              case "F":
                iElm.css({
                  'color': $scope.colorsMap.F
                });
                iElm.html(iAttrs.colorLetter);
                break;
            }
          };
          jsonLoader.getJSON($scope.onReadyLoadColors, null, "directives/colorLetter/colorsMap.json");
        }
      };
    })
})();
