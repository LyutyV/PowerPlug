function setEventItems(vm) {
    vm.currentEventScripts = [];
}

function setEventEvents(vm, $scope, $document, $mdMedia, $mdDialog, ScriptsResource) {
    vm.showEventScripts = showEventScripts;
    vm.removeEventScript = removeEventScript;
    vm.addEventScripts = eventScriptDialog;

    function eventScriptDialog(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/addScipt.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            fullscreen: useFullScreen,
            locals: {},
            controller: DialogController,
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });

        function DialogController($scope, $mdDialog, $document) {
            ScriptsResource.query(function (data) {
                $scope.eventScripts = data;
            }, function (err) {
                onError(err);
            });

            $scope.addEventScripts = function () {
                angular.forEach(vm.savingPlan.events, function (valueEvent, keyEvent) {
                    if (vm.currentEvent === valueEvent.eventType) {
                        angular.forEach(angular.element('.script-selection:checked'), function (value, key) {
                            var newScriptId = Number(value.getAttribute('data-id'));
                            var newScriptName = value.getAttribute('data-name');
                            var newScriptGUID = value.getAttribute('data-guid');
                            var isExist = false;

                            angular.forEach(vm.savingPlan.events[keyEvent].scripts, function (valueContainer, keyContainer) {
                                if (valueContainer.scriptId === newScriptId) {
                                    isExist = true;
                                }
                            });

                            if (!isExist) {
                                vm.savingPlan.events[keyEvent].scripts.push({ context: 'System', scriptGUID: newScriptGUID, scriptName: newScriptName, scriptId: newScriptId });
                            }
                        });
                    }
                });

                $mdDialog.hide();
            };

            $scope.closeEventScripts = function () {
                $mdDialog.cancel();
            };
        }
    };

    function showEventScripts(eventType) {
        vm.currentEventScripts = [];
        if (vm.savingPlan.events) {
            angular.forEach(vm.savingPlan.events, function (value, key) {
                if (value.eventType === eventType) {
                    vm.currentEventScripts = value.scripts;
                    vm.currentEvent = value.eventType;
                }
            });
        }
    };

    function removeEventScript(scriptId) {
        angular.forEach(vm.savingPlan.events, function (value, key) {
            if (vm.currentEvent === value.eventType) {
                angular.forEach(vm.savingPlan.events[key].scripts, function (valueScript, keyScript) {
                    if (scriptId === valueScript.scriptId) {
                        vm.savingPlan.events[key].scripts.splice(keyScript, 1);
                    }
                });
            }
        });
    };
}
