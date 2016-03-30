/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ComputerGroupsCtrl',
                     ['$state', 'ComputerGroupsResource', ComputerGroupsCtrl]);


    function ComputerGroupsCtrl($state, ComputerGroupsResource) {
        var vm = this;
        
        ComputerGroupsResource.get(function (data) {
            vm.computerGroups = data.computerGroups;
        }, function (error) {
            if (error.status === 401 || error.status === -1)
            {                
                $state.go('login');
            }
        });
    }
}());