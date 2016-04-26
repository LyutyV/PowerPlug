/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('WakeupPortalPermissionCtrl',
                     ['$state', '$document', '$mdDialog', '$mdMedia', '$scope', '$uibModal', 'WakeupPortalPermissionResource', WakeupPortalPermissionCtrl]);


    function WakeupPortalPermissionCtrl($state, $document, $mdDialog, $mdMedia, $scope, $uibModal, WakeupPortalPermissionResource) {
        var vm = this;

        WakeupPortalPermissionResource.query(function (data) {
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
            vm.permissions = data;
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
            WakeupPortalPermissionResource.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            WakeupPortalPermissionResource.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }

        vm.showPowerRateDialog = function (powerRateId, ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                templateUrl: 'views/settings/dialogs/powerRate.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                bindToController: true,
                fullscreen: useFullScreen,
                locals: { powerRateId: powerRateId, prices: vm.prices },
                controller: DialogController,
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

            function DialogController($scope, $mdDialog, powerRateId, prices) {
                $scope.prices = prices;
                $scope.addPowerCostDialog = function () {
                    $uibModal.open({
                        templateUrl: 'views/settings/dialogs/addPowerCost.html',
                        resolve: { },
                        controller: DialogController,
                    })

                    function DialogController($scope, $uibModalInstance, $document) {
                        $scope.insertPowerCost = function () {                            
                            $uibModalInstance.dismiss('OK');
                        };

                        $scope.closeSavingApplication = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                }

                $scope.closeScriptDialog = function () {                    
                    $mdDialog.cancel();
                };
            }

        }
    }
}());