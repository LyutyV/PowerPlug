(function() {
  'use strict';

  angular
    .module('powerPlug')
    .controller('SavingPlansController', function() {
      var vm = this;

      // temporary load table content from json. Later from backend
      vm.menuTableItems = [{
        "PlainDetails": {
          "Saving": "Normal",
          "Owner": "Omer Hagay"
        },
        "ProgectedEfficiency": "B",
        "ActualReportedEfficiency": "C",
        "AssignedComputers": 154,
        "ActualReporting": 150
      }, {
        "PlainDetails": {
          "Saving": "Normal",
          "Owner": "Omer Hagay"
        },
        "ProgectedEfficiency": "A",
        "ActualReportedEfficiency": "D",
        "AssignedComputers": 12,
        "ActualReporting": 11
      }, {
        "PlainDetails": {
          "Saving": "Normal",
          "Owner": "Omer Hagay"
        },
        "ProgectedEfficiency": "E",
        "ActualReportedEfficiency": "F",
        "AssignedComputers": 297,
        "ActualReporting": 290
      }]

      // vm.filename = 'savingPlans/tmpTableContent.json';
      // vm.onReadyLoadTableContent = function(tableContent) {
      //   vm.menuTableItems = tableContent;
      // }
      //
      // jsonLoader.getJSON(vm.onReadyLoadTableContent, null, vm.filename);
      // End temporary load table content from json. Later from backend

      // Table sorter
      vm.sort = {
        column: '',
        descending: false
      };

      vm.changeSorting = function(column) {
        var sort = vm.sort;

        if (sort.column == column) {
          sort.descending = !sort.descending;
        } else {
          sort.column = column;
          sort.descending = false;
        }
      };
      // End table sorter
    })
})();
