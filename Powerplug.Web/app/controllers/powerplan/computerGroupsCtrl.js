/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ComputerGroupsCtrl',
                     ['$state', 'ComputerGroupsResource', ComputerGroupsCtrl]);


    function ComputerGroupsCtrl($state, ComputerGroupsResource) {
        var vm = this;
        
        ComputerGroupsResource.query(function (data) {
            vm.computerGroups = data;
        }, function (error) {
            if (error.status === 401 || error.status === -1)
            {                
                $state.go('login');
            }
        });
    }
}());