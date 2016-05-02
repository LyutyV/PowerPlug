﻿/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ConsolePermissionCtrl',
                     ['$state', '$document', '$uibModal', '$scope', 'ConsolePermissionResource', ConsolePermissionCtrl]);


    function ConsolePermissionCtrl($state, $document, $uibModal, $scope, ConsolePermissionResource) {
        var vm = this;        
        ConsolePermissionResource.query(function (data) {
            onSuccess(data);
        }, function (error) {
            onError(error);
        });
        function init() {
            addUserPopupHandler.init($uibModal);
        }
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
            ConsolePermissionResource.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }
        vm.discardChanges = function () {
            ConsolePermissionResource.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }
        vm.openAddUserDialog = addUserPopupHandler.openDialog;
        //================init=====================
        init();

    }
}());