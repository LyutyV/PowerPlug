(function(){
  'use strict';

  angular
    .module('powerPlug')
    .controller('SavingPlansController', function(jsonLoader){
      var vm = this;

      // temporary load table content from json. Later from backend
      vm.filename = 'savingPlans/tmpTableContent.json';
      vm.onReadyLoadTableContent = function(tableContent) {
        vm.menuTableItems = tableContent;
      }

      jsonLoader.getJSON(vm.onReadyLoadTableContent, null, vm.filename);
      // End temporary load table content from json. Later from backend

    })
})()
