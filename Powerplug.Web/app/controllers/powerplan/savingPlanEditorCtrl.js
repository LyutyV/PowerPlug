
(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('SavingPlanEditorCtrl', ['$state', '$stateParams', '$scope', '$animate', '$document', '$uibModal', '$mdDialog', '$mdMedia', 'SavingPlansResource', 'ComputersResource', 'ComputerGroupsResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $uibModal, $mdDialog, $mdMedia, SavingPlansResource, ComputersResource, ComputerGroupsResource, ScriptsResource) {
        var vm = this;
        vm.policyId = $stateParams.policyId;

        // Check all checkbox in Computers section
        vm.checkAll = function (seed) {
          switch (seed) {
            case 'groups':
            {
              if (vm.selectedAllGroups) {
                  vm.selectedAllGroups = true;
              } else {
                  vm.selectedAllGroups = false;
              }
              angular.forEach(vm.savingPlan.compGroups, function (group) {
                  group.selected = vm.selectedAllGroups;
              });
              break;
            }
            case 'comps':
            {
              if (vm.selectedAllComps) {
                  vm.selectedAllComps = true;
              } else {
                  vm.selectedAllComps = false;
              }
              angular.forEach(vm.savingPlan.computers, function (computer) {
                  computer.selected = vm.selectedAllComps;
              });
              break;
            }
            default:
              console.log('Error. Default value of select all (groups or comps) agr');
          }
        };
        // End check all checkbox in Computers section

        //Scrollbar (Dirty way because of old Jquery)
        if (!$document.mCustomScrollbar) {
            $document.__proto__.mCustomScrollbar = $.mCustomScrollbar;
        }
        vm.config = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 329,
            scrollInertia: 0
        }

        //End scrollbar

        //Init
        overviewHandler.init(vm);
        actionDialogHandler.init(vm, $scope, $uibModal);
        eventHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ScriptsResource);
        actionHandler.init(vm);
        workHoursHandler.init(vm);
        savingHandler.init(vm, $document);
        computersHandler.init(vm, $scope, $document, $mdDialog, $mdMedia, ComputersResource, ComputerGroupsResource);
        permissionHandler.init(vm, $scope, $document, $mdDialog, $mdMedia);

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
            vm.showEventScripts(1);   //this show's right part of the Events section on page load.
            overviewHandler.setOverviewGraphs();
            //
            console.log(vm.savingPlan);
            for (var i in vm.savingPlan.actions) {
                vm.getActionText(vm.savingPlan.actions[i]);
            }
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
        vm.addPermissions = permissionHandler.addPermissionsDialog;
        setTimeout(function(){
            $(".scroll").click(function(event) {
                event.preventDefault();
                $('html,body').animate( { scrollTop:$(this.hash).offset().top } , 500);
            } );
        },0);
    }
}());
