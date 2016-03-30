(function() {
  'use strict';

  angular
    .module('powerPlug')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/',
        templateUrl: 'app/components/main.html'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
