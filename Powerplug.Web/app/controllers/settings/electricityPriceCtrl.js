/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ElectricityPriceCtrl',
                     ['$state', '$document', '$mdDialog', '$mdMedia', '$scope', 'ElectricityPriceResource', ElectricityPriceCtrl]);


    function ElectricityPriceCtrl($state, $document, $mdDialog, $mdMedia, $scope, ElectricityPriceResource) {
        var vm = this;

        ElectricityPriceResource.query(function (data) {
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
            vm.prices = data;
        }

        vm.checkAll = function (seed) {
            if (vm.selectedAll) {
                vm.selectedAll = true;
            } else {
                vm.selectedAll = false;
            }
            angular.forEach(vm.permissions, function (permission) {
                permission.selected = vm.selectedAll;
            });
        }

        vm.saveChanges = function () {
            ///dooo
            ElectricityPriceResource.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            ElectricityPriceResource.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }        
    }
}());