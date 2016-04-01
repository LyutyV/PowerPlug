(function() {
  'use strict';

  angular
    .module('powerPlug')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'app/components/main.html'
      });

    $urlRouterProvider.otherwise('saving_plans');
  }

})();