(function() {
  'use strict';

  angular
    .module('powerPlug')
    .config(routerConfig);

  function routerConfig($stateProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        controller: 'dashboardController',
        controllerAs: 'vm',
        templateUrl: 'app/components/dashboard/dashboard.html'
      });
  }

})();
