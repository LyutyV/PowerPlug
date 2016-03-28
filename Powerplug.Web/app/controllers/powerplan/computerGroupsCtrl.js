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
            console.log(data);
            vm.computerGroups = data.computerGroups;
        }, function (error) {
            console.log(error);
            if (error.status === 401)
            {                
                $state.go('login');
            }
        });
    }
}());