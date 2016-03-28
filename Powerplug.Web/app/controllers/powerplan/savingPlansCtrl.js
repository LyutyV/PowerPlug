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
        }, function (error) {
            console.log(error);
            if (error.status === 401 && error.status === -1)
            {
                $state.go('login');
            }
        });
    }
}());