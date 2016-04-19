/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('SavingPlansCtrl',
                     ['$state', '$uibModal', 'SavingPlansResource', SavingPlansCtrl]);


    function SavingPlansCtrl($state, $uibModal, SavingPlansResource) {
        var vm = this;

        SavingPlansResource.basic.query(function (data) {
            vm.savingPlans = data;
            managePPListHandler.init(vm, $uibModal, SavingPlansResource);
        }, function (error) {            
            if (error.status === 401 || error.status === -1)
            {
                $state.go('login');
            }
        });

        vm.sort = {
            column: '',
            descending: false
        };

        vm.changeSorting = function (column) {
            var sort = vm.sort;

            if (sort.column == column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
        };

        //init  manage power plan list handler
        vm.openManageDialog = managePPListHandler.openManageDialog;
    }
}());