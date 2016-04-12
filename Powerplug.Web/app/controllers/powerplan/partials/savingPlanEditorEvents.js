var eventHandler = {
    vm: {},
    $scope: {},
    $document: [],
    $mdMedia: {},
    $mdDialog: {},
    ScriptsResource: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia, ScriptsResource) {
        eventHandler.vm = vm;
        eventHandler.$scope = $scope;
        eventHandler.$document = $document;
        eventHandler.$mdDialog = $mdDialog;
        eventHandler.$mdMedia = $mdMedia;
        eventHandler.ScriptsResource = ScriptsResource;
    },
    setEventItems: function () {
        eventHandler.vm.currentEventScripts = [];        
    },
    eventScriptDialog: function (ev) {
        var useFullScreen = (eventHandler.$mdMedia('sm') || eventHandler.$mdMedia('xs')) && eventHandler.$scope.customFullscreen;
        eventHandler.$mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/addScipt.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            fullscreen: useFullScreen,
            locals: {},
            controller: DialogController,
        });
        eventHandler.$scope.$watch(function () {
            return eventHandler.$mdMedia('xs') || eventHandler.$mdMedia('sm');
        }, function (wantsFullScreen) {
            eventHandler.$scope.customFullscreen = (wantsFullScreen === true);
        });

        function DialogController($scope, $mdDialog) {
            eventHandler.ScriptsResource.query(function (data) {
                console.log(data);
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
                        eventHandler.vm.savingPlan.events.push({ eventType: eventHandler.vm.currentEvent, scripts: [] });                        
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
                            eventHandler.vm.savingPlan.events[keyEvent].scripts.push({ context: 'System', scriptGUID: newScriptGUID, scriptName: newScriptName, scriptId: newScriptId });
                        }
                    });

                    eventHandler.vm.currentEventScripts = eventHandler.vm.savingPlan.events[keyEvent].scripts;
                }
                
                $mdDialog.hide();
            };

            $scope.closeEventScripts = function () {
                $mdDialog.cancel();
            };
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