(function () {
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
                     ['$state', '$stateParams', '$scope', '$animate', '$document', '$uibModal', '$mdDialog', '$mdMedia', 'SavingPlansResource', 'ComputersResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $uibModal, $mdDialog, $mdMedia, SavingPlansResource, ComputersResource, ScriptsResource) {
        var vm = this;
        var policyId = $stateParams.policyId;

        //Init
        overviewHandler.init(vm);
        actionDialogHandler.init(vm, $scope, $uibModal);
        eventHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ScriptsResource);
        actionHandler.init(vm);
        workHoursHandler.init(vm);
        savingHandler.init(vm, $document);

        SavingPlansResource.get({ policyId: policyId }, function (data) {
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

            overviewHandler.setOverviewItems();
            actionHandler.setActionItems();
            actionDialogHandler.setActionDialogItems();
            savingHandler.setSavingItems();
            workHoursHandler.setWorkHoursItems();
            eventHandler.setEventItems();

            console.log(vm.savingPlan);
        }

        overviewHandler.setOverviewGraphs();
       
        //Html Elements Events
        vm.saveChanges = function () {
            savingHandler.updateSavingItems();
            vm.savingPlan.$update(function (data) {
                onSuccess(data);            
            }, function (err) {
                onError(err);
            });
        }

        vm.addEventScripts = eventHandler.eventScriptDialog;
        vm.showEventScripts = eventHandler.showEventScripts;
        vm.removeEventScript = eventHandler.removeEventScript;
        //dialog
        vm.showAdvanced = actionDialogHandler.showAdvanced;
    }
}());