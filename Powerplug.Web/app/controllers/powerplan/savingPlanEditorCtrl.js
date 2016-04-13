﻿(function () {
    'use strict';
    angular
        .module('powerPlug')
        .directive('convertToNumber', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function(val) {
                        return val ? parseInt(val, 10) : null;
                    });
                    ngModel.$formatters.push(function(val) {
                        return val ? '' + val : null;
                    });
                }
            };
        })
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', '$scope', '$animate', '$document', '$uibModal', '$mdDialog', '$mdMedia', 'SavingPlansResource', 'ComputersResource', 'ComputerGroupsResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $uibModal, $mdDialog, $mdMedia, SavingPlansResource, ComputersResource, ComputerGroupsResource, ScriptsResource) {
        var vm = this;
        vm.policyId = $stateParams.policyId;

        //Init
        overviewHandler.init(vm);
        actionDialogHandler.init(vm, $scope, $uibModal);
        eventHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ScriptsResource);
        actionHandler.init(vm);
        workHoursHandler.init(vm);
        savingHandler.init(vm, $document);
        computersHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ComputersResource, ComputerGroupsResource);

        SavingPlansResource.get({ policyId: vm.policyId }, function (data) {
            onSuccess(data);
        }, function (err) {
            onError(err);
        });


        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
            vm.savingPlan = data;
            console.log(vm.savingPlan);
            overviewHandler.setOverviewItems();
            actionHandler.setActionItems();
            actionDialogHandler.setActionDialogItems();
            savingHandler.setSavingItems();
            workHoursHandler.setWorkHoursItems();
            eventHandler.setEventItems();
            computersHandler.setComputerItems();

            console.log(vm.savingPlan);
        }

        overviewHandler.setOverviewGraphs();

        //Html Elements Events
        vm.saveChanges = function () {
            savingHandler.updateSavingItems();
            computersHandler.prepareComputersDelta();
            computersHandler.prepareComputerGroupsDelta();
            if (vm.policyId > 0) {
                vm.savingPlan.$update(function (data) {
                    onSuccess(data);
                }, function (err) {
                    onError(err);
                });
            }
            else {
                vm.savingPlan.$save(function (data) {
                    onSuccess(data);
                }, function (err) {
                    onError(err);
                });
            }
        }

        //dialog
        vm.addEventScripts = eventHandler.eventScriptDialog;
        vm.showAdvanced = actionDialogHandler.showAdvanced;
        vm.showAddComputers = computersHandler.addComputerDialog;
        vm.showAddComputerGroups = computersHandler.addComputerGroupsDialog;
        //events
        vm.showEventScripts = eventHandler.showEventScripts;
        vm.removeEventScript = eventHandler.removeEventScript;
        vm.removeComputerGroups = computersHandler.removeComputerGroups;
  		vm.removeComputers = computersHandler.removeComputers;
        //actions
  		vm.getActionText = actionHandler.getActionText
        //dialog
        vm.openActionDialog = actionDialogHandler.openActionDialog;
        vm.createNewAction = actionDialogHandler.createNewAction;
    }
}());
