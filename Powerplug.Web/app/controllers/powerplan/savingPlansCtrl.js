/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('SavingPlansCtrl',
                     ['$state', 'SavingPlansResource', SavingPlansCtrl]);


    function SavingPlansCtrl($state, SavingPlansResource) {
        var vm = this;
        
        SavingPlansResource.query(function (data) {
            vm.savingPlans = data;
            console.log(data);
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
    }
}());