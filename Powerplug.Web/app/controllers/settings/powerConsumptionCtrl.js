/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('PowerConsumptionCtrl',
                     ['$state', 'PowerConsumptionResource', PowerConsumptionCtrl]);


    function PowerConsumptionCtrl($state, PowerConsumptionResource) {
        var vm = this;

        PowerConsumptionResource.get(function (data) {
            console.log(data);
            onSuccess(data);
        }, function (error) {
            onError(error);
        });

        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
            vm.powerConsumption = data;
        }

        vm.ChangeConsumption = function (computerType, consumptionStatus, itemValue) {
            angular.forEach(vm.powerConsumption.computers, function (value, key) {
                if (value.assignment === 'ComputerType' && value.computerType === computerType) {                    
                    value[consumptionStatus] = itemValue;                    
                }                
            });

            angular.forEach(vm.powerConsumption.models, function (value, key) {
                if (value.assignment === 'ComputerType' && value.computerType === computerType) {
                    value[consumptionStatus] = itemValue;
                }
            });
        }
    }
}());