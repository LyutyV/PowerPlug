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
    }
}());