﻿
var eventHandler = {
    vm: {},
    $scope: {},
    $document: [],
    $mdDialog: {},
    ScriptsResource: {},
    init: function (vm, $scope, $document, $mdDialog, ScriptsResource) {
        eventHandler.vm = vm;
        eventHandler.$scope = $scope;
        eventHandler.$document = $document;
        eventHandler.$mdDialog = $mdDialog;
        eventHandler.ScriptsResource = ScriptsResource;
    },
    setEventItems: function () {
        eventHandler.vm.currentEventScripts = [];
        eventHandler.vm.showEventScripts(1);
    },
    eventScriptDialog: function (ev) {
        eventHandler.$mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/addScipt.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            locals: {},
            controller: DialogController,
        });
       
        function DialogController($scope, $mdDialog) {
            eventHandler.ScriptsResource.basic.query(function (data) {
                $scope.eventScripts = data;
            }, function (err) {
                onError(err);
            });

            $scope.addEventScripts = function () {
                var isEventFound = false;
                angular.forEach(eventHandler.vm.savingPlan.events, function (valueEvent, keyEvent) {
                    if (eventHandler.vm.currentEvent === valueEvent.eventType) {
                        isEventFound = true;
                        fillScripts(keyEvent);
                    }
                });
                if (isEventFound === false) {
                    if (!eventHandler.vm.savingPlan.events) {
                        eventHandler.vm.savingPlan.events = [];
                        eventHandler.vm.savingPlan.events.push({
                            eventType: eventHandler.vm.currentEvent,
                            scripts: []
                        });
                    }
                    fillScripts(0);
                }

                function fillScripts(keyEvent) {
                    angular.forEach(angular.element('.script-selection:checked'), function (value, key) {
                        var newScriptId = Number(value.getAttribute('data-id'));
                        var newScriptName = value.getAttribute('data-name');
                        var newScriptGUID = value.getAttribute('data-guid');
                        var isExist = false;

                        angular.forEach(eventHandler.vm.savingPlan.events[keyEvent].scripts, function (valueContainer, keyContainer) {
                            if (valueContainer.scriptId === newScriptId) {
                                isExist = true;
                            }
                        });

                        if (!isExist) {
                            eventHandler.vm.savingPlan.events[keyEvent].scripts.push({
                                context: 'System',
                                scriptGUID: newScriptGUID,
                                scriptName: newScriptName,
                                scriptId: newScriptId
                            });
                        }
                    });

                    eventHandler.vm.currentEventScripts = eventHandler.vm.savingPlan.events[keyEvent].scripts;
                }

                $mdDialog.hide();
            };

            $scope.closeEventScripts = function () {
                $mdDialog.cancel();
            };

            // Select all checkboxes function in add script dialog
            $scope.checkAll = function (seed) {
                switch (seed) {
                case 'scripts':
                    {
                        if ($scope.selectedAllScripts) {
                            $scope.selectedAllScripts = true;
                        } else {
                            $scope.selectedAllScripts = false;
                        }
                        angular.forEach($scope.eventScripts, function (script) {
                            script.selected = $scope.selectedAllScripts;
                        });
                        break;
                    }
                default:
                    console.log('Error. Default value of select all (groups or comps) agr');
                }
            }

            // End select all checkboxes function in add script dialog
        }
    },
    showEventScripts: function (eventType) {
        eventHandler.vm.currentEventScripts = [];
        eventHandler.vm.currentEvent = eventType;
        if (eventHandler.vm.savingPlan.events) {
            angular.forEach(eventHandler.vm.savingPlan.events, function (value, key) {
                if (value.eventType === eventType) {
                    eventHandler.vm.currentEventScripts = value.scripts;
                }
            });
        }
    },
    removeEventScript: function (scriptId) {
        angular.forEach(eventHandler.vm.savingPlan.events, function (value, key) {
            if (eventHandler.vm.currentEvent === value.eventType) {
                angular.forEach(eventHandler.vm.savingPlan.events[key].scripts, function (valueScript, keyScript) {
                    if (scriptId === valueScript.scriptId) {
                        eventHandler.vm.savingPlan.events[key].scripts.splice(keyScript, 1);
                    }
                });
            }
        });
    }
};
