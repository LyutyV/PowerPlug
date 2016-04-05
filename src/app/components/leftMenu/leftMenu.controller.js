(function() {
  'use strict';

  angular
    .module('powerPlug')
    .controller('LeftMenuController', function($state) {
      var vm = this;
      //tmp
      vm.menuItems = [{
        "text": "Dashboard",
        "sref": "app.dashboard",
        "icon": "fa fa-home",
        "submenu": []
      }, {
        "text": "Real-Time",
        "sref": "#",
        "icon": "fa fa-clock-o",
        "submenu": []
      }, {
        "text": "Saving Plans",
        "sref": "app.savingPlans",
        "icon": "fa fa-list-alt",
        "submenu": []

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
