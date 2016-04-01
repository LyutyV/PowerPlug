(function() {
  'use strict';

  angular
    .module('powerPlug')
    .config(routerConfig);

  function routerConfig($stateProvider) {
    $stateProvider
      .state('app.savingPlans', {
        url: '/saving_plans',
        title: 'Saving Plans',
        controller: 'SavingPlansController',
        controllerAs: 'vm',
        templateUrl: 'app/components/savingPlans/savingPlans.html'
      });
  }

})();
