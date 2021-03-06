﻿/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('LocationsCtrl',
                     ['$state', '$document', '$scope', '$uibModal', 'LocationsResource', LocationsCtrl]);


    function LocationsCtrl($state, $document, $scope, $uibModal, LocationsResource) {
        var vm = this;

        LocationsResource.query(function (data) {
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
            vm.location = data;
        }

        vm.saveChanges = function () {
            ///dooo
            LocationsResource.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            LocationsResource.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }

        vm.showLocationPowerRateDialog = function () {
            $uibModal.open({
                templateUrl: 'views/settings/dialogs/locationPowerRate.html',
                resolve: { params: function () { return {} } },
                controller: DialogController,
                backdrop: 'static',
                size: 'large'
            });

            function DialogController($scope, $uibModalInstance, params) {
                //$scope.prices = params.prices;
                $scope.addLocationPowerRateDialog = function () {
                    var modal = $uibModal.open({
                        templateUrl: 'views/settings/dialogs/addLocationPowerRate.html',
                        resolve: {},
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