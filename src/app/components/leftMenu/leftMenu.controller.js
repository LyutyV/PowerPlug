(function() {
  'use strict';

  angular
    .module('powerPlug')
    .controller('LeftMenuController', function() {
      var vm = this;
      //tmp
      vm.menuItems = [{
        "text": "Dashboard",
        "sref": "#",
        "icon": "fa fa-home",
        "submenu": []
      }, {
        "text": "Real-Time",
        "sref": "#",
        "icon": "fa fa-clock-o",
        "submenu": []
      }, {
        "text": "Saving Plans",
        "sref": "#",
        "icon": "fa fa-list-alt",
        "submenu": [{
          "text": "PowerPlug Saving plan 1/2016",
          "sref": ""
        }]

      }, {
        "text": "Reports",
        "sref": "#",
        "icon": "fa fa-line-chart",
        "submenu": []
      }, {
        "text": "Settings",
        "sref": "#",
        "icon": "fa fa-gear",
        "submenu": []
      }, {
        "text": "Configurations",
        "sref": "#",
        "icon": "fa fa-wrench",
        "submenu": []
      }]

      //endtmp




      // vm.filename = 'leftMenu/leftMenu.json';
      // vm.onReadyLoadMenu = function(menu) {
      //   vm.menuItems = menu;
      // }
      //
      // jsonLoader.getJSON(vm.onReadyLoadMenu, null, vm.filename);
    })
})();
