(function(){
  'use strict';

  angular
    .module('powerPlug')
    .controller('HeaderController', ['$state', function($state){
        var vm = this;
        vm.state = $state;
    }])
})();
