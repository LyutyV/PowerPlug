/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ElectricityPriceCtrl',
                     ['$state', '$document', '$scope', '$uibModal', 'ElectricityPriceResource', ElectricityPriceCtrl]);


    function ElectricityPriceCtrl($state, $document, $scope, $uibModal, ElectricityPriceResource) {
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

        vm.saveChanges = function () {
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

        vm.showPowerRateDialog = function (powerRateId, ev) {
            $uibModal.open({
                templateUrl: 'views/settings/dialogs/powerRate.html',
                resolve: { params: function () { return { powerRateId: powerRateId, prices: vm.prices}} },
                controller: DialogController,
                backdrop: 'static',
                size: 'large'
            });

            function DialogController($scope, $uibModalInstance, params) {
                $scope.prices = params.prices;
                $scope.addPowerCostDialog = function () {
                    var modal = $uibModal.open({
                        templateUrl: 'views/settings/dialogs/addPowerCost.html',
                        resolve: { },
                        controller: DialogController,
                        backdrop: 'static'
                    })
                    modal.rendered.then(function () {
                        //start time  picker
                        $('.power-plug-date-picker').datetimepicker({
                            format: 'MM/DD/YYYY',
                            defaultDate: new Date()
                        });
                    });

                    modal.closed.then(function () {
                        //remove date & time picker
                        $('.datetimepicker').datetimepicker('remove');
                    });

                    return modal;

                    function DialogController($scope, $uibModalInstance, $document) {
                        $scope.insertPowerCost = function () {                            
                            $uibModalInstance.close();
                        };

                        $scope.closeSavingApplication = function () {
                            $uibModalInstance.dismiss();
                        };
                    }
                }

                $scope.closeScriptDialog = function () {                    
                    $uibModalInstance.dismiss();
                };
            }

        }
    }
}());