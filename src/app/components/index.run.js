(function() {
  'use strict';

  angular
    .module('powerPlug')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
