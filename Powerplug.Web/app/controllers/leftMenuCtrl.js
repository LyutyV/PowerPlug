(function () {
    'use strict';

    angular
      .module('powerPlug')
      .controller('LeftMenuController', ['$state', function ($state) {          
          var vm = this;
          vm.state = $state;
          //tmp
          vm.menuItems = [
          {
              "text": "Dashboard",
              "sref": "dashboard",
              "icon": "fa fa-home",
              "submenu": []
          },
          {
              "text": "Real-Time",
              "sref": "#",
              "icon": "fa fa-clock-o",
              "submenu": []
          },
          {
              "text": "Saving Plans",
              "sref": "savingPlans",
              "icon": "fa fa-list-alt",
              "submenu": [
                {
                    "text": "PowerPlug Saving plan 1/2016",
                    "sref": ""
                }
              ]
          },
          {
              "text": "Reports",
              "sref": "#",
              "icon": "fa fa-line-chart",
              "submenu": []
          },
          {
              "text": "Settings",
              "sref": "settings",
              "icon": "fa fa-gear",
              "submenu": []
          }];
      }]);
})();