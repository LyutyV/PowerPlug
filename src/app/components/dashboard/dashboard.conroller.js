(function() {
  'use strict';

  angular
    .module('powerPlug')
    .controller('dashboardController', function($scope) {
      var vm = this;

      $scope.text = "dfhdfhjdsfgsfgjfd"

      $scope.done = function(data2){
        console.log(data2);
      };

      $scope.preview = function(data1){
        console.log(data1);
      };


    })
})();
