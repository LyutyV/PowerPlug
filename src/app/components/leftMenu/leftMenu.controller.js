(function() {
  'use strict';

  angular
    .module('powerPlug')
    .controller('LeftMenuController', function(jsonLoader) {
      var vm = this;
      vm.filename = 'leftMenu/leftMenu.json';
      vm.onReadyLoadMenu = function(menu) {
        vm.menuItems = menu;
      }

      jsonLoader.getJSON(vm.onReadyLoadMenu, null, vm.filename);
    })
})()