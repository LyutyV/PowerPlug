/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', 'SavingPlansResource', SavingPlanEditorCtrl]);


    function SavingPlanEditorCtrl($state, $stateParams, SavingPlansResource) {
        var vm = this;
        var policyId = $stateParams.policyId
        SavingPlansResource.get({ policyId: policyId }, function (data) {
            vm.savingPlan = data;
            vm.savingPlan.validFrom = new Date(vm.savingPlan.validFrom);
            vm.savingPlan.validTo = new Date(vm.savingPlan.validTo);
            console.log(data);
        }, function (error) {            
            if (error.status === 401 && error.status === -1)
            {
                $state.go('login');
            }
        });
    }
}());