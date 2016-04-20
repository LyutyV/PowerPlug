
(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', '$scope', '$animate', '$document', '$uibModal', '$mdDialog', '$mdMedia', 'SavingPlansResource', 'ComputersResource', 'ComputerGroupsResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $uibModal, $mdDialog, $mdMedia, SavingPlansResource, ComputersResource, ComputerGroupsResource, ScriptsResource) {
        var vm = this;
        vm.policyId = $stateParams.policyId;

// tmp model for selects in Savings section
        vm.comboItems = [{
          name: '20 minutes'
        }, {
          name: 'Sleep'
        }, {
          name: '45 minutes'
        }, {
          name: '10 percent'
        }, {
          name: '500 KB/Second'
        }, {
          name: '100 KB/Second'
        }];
        vm.modelForDropdown = [vm.comboItems[0], vm.comboItems[1], vm.comboItems[2],  //these for top dropdowns on work day tab
                                vm.comboItems[0], vm.comboItems[1], vm.comboItems[2],  //these for top dropdowns on non work day tab
                                vm.comboItems[3], vm.comboItems[4], vm.comboItems[5],  //these for dropdowns on performanse metrics tab on work day tab
                                vm.comboItems[3], vm.comboItems[4], vm.comboItems[5]];  //these for dropdowns on performanse metrics tab on non work day tab
// End tmp model for selects in Savings section

        //Init
        overviewHandler.init(vm);
        actionDialogHandler.init(vm, $scope, $uibModal);
        eventHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ScriptsResource);
        actionHandler.init(vm);
        workHoursHandler.init(vm);
        savingHandler.init(vm, $document);
        computersHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ComputersResource, ComputerGroupsResource);

        SavingPlansResource.basic.get({
            policyId: vm.policyId
        }, function (data) {
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

        function jsonValidation(json) {
            if (json.savings.work.options === undefined) {
                json.savings.work.options = {};
            }
            if (json.savings.nonWork.options === undefined) {
                json.savings.nonWork.options = {};
            }
        }

        function onSuccess(data) {
            jsonValidation(data);
            vm.savingPlan = data;
            overviewHandler.setOverviewItems();
            actionHandler.setActionItems();
            actionDialogHandler.setActionDialogItems();
            savingHandler.setSavingItems();
            workHoursHandler.setWorkHoursItems();
            eventHandler.setEventItems();
            computersHandler.setComputerItems();
            //
            overviewHandler.setOverviewGraphs();
            //
            console.log(vm.savingPlan);
        }

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
            } else {
                /**********temp ---to be removed*******************/
                var d;
                d = new Date();
                vm.savingPlan.policyName = "Plan - " + d.getTime();
                /************************************************/
                vm.savingPlan.$save({
                    policyId: null
                }, function (data) {
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
