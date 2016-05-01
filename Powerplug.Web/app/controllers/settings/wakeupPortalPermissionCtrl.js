/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('WakeupPortalPermissionCtrl',
                     ['$state', '$document', '$mdDialog', '$scope', '$uibModal', 'WakeupPortalPermissionResource', WakeupPortalPermissionCtrl]);


    function WakeupPortalPermissionCtrl($state, $document, $mdDialog, $scope, $uibModal, WakeupPortalPermissionResource) {
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
            console.log(data);
        }

        function initPopups() {
            editWakeupPermissionHandler.init($mdDialog);
            vm.showEditWakeupPermission = editWakeupPermissionHandler.openDialog;
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
        //===================init============================
        initPopups();
    }
}());