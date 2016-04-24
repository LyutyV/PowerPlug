/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ConsolePermissionCtrl',
                     ['$state', '$document', '$mdDialog', '$mdMedia', '$scope', 'ConsolePermissionResource', ConsolePermissionCtrl]);


    function ConsolePermissionCtrl($state, $document, $mdDialog, $mdMedia, $scope, ConsolePermissionResource) {
        var vm = this;

        ConsolePermissionResource.query(function (data) {
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
            vm.scripts = data;
            vm.deletedScripts = [];
            vm.currentScriptText = '';
            vm.currentScriptId = 0;
            vm.currentScriptType = '';
        }        

        vm.saveChanges = function () {
            ///dooo
            ConsolePermissionResource.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            ScriptsResource.detailed.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }        
    }
}());