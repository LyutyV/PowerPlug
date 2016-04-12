/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ComputerGroupsCtrl',
                     ['$state', '$document', 'ComputerGroupsResource', ComputerGroupsCtrl]);


    function ComputerGroupsCtrl($state, $document, ComputerGroupsResource) {
        var vm = this;
        
        ComputerGroupsResource.query(function (data) {
            vm.computerGroups = data;
            console.log(data);
        }, function (error) {
            if (error.status === 401 || error.status === -1)
            {                
                $state.go('login');
            }
        });
                
        vm.selectComputerGroup = function (ev) {
            angular.forEach(angular.element('.computer-group-row'), function (value) {
                value.className = value.className.replace('bg-computer-group-selected', '');
            });

            ev.target.parentNode.className = ev.target.parentNode.className + ' bg-computer-group-selected';
            vm.currentGroup = ev.target.parentNode.attributes["data-id"].value;
        }
    }
}());