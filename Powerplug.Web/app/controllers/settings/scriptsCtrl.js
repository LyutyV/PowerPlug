﻿/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ScriptsCtrl',
                     ['$state', '$document', '$mdDialog', '$mdMedia', '$scope', 'ScriptsResource', ScriptsCtrl]);


    function ScriptsCtrl($state, $document, $mdDialog, $mdMedia, $scope, ScriptsResource) {
        var vm = this;

        ScriptsResource.detailed.query(function (data) {
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

        vm.selectScript = function (ev) {
            if (ev.target.tagName.toLowerCase() !== 'span') {
                angular.forEach(angular.element('.script-row'), function (value) {
                    value.className = value.className.replace('bg-script-selected', '');
                });

                ev.target.parentNode.className = ev.target.parentNode.className + ' bg-script-selected';
                var scriptId = ev.target.parentNode.attributes["data-id"].value;
                angular.forEach(vm.scripts, function (value) {
                    if (value.scriptId === Number(scriptId)) {
                        vm.currentScriptText = value.scriptText;
                        vm.currentScriptId = value.scriptId;
                        vm.currentScriptType = value.scriptType;
                    }
                });
            }
        }

        vm.changeScriptText = function () {
            angular.forEach(vm.scripts, function (value) {
                if (value.scriptId === vm.currentScriptId) {
                    value.scriptText = vm.currentScriptText;
                    if (value.status !== 'added') {
                        value.status = 'updated';
                    }                    
                }
            });
        }

        vm.changeScriptType = function () {
            angular.forEach(vm.scripts, function (value) {
                if (value.scriptId === vm.currentScriptId) {
                    value.scriptType = vm.currentScriptType;
                    if (value.status !== 'added') {
                        value.status = 'updated';
                    }
                }
            });
        }

        vm.removeScript = function (scriptId) {
            angular.forEach(vm.scripts, function (value, key) {
                if (scriptId === value.scriptId) {
                    if (value.status !== 'added') {
                        vm.deletedScripts.push({ scriptId: value.scriptId });
                    }
                    vm.scripts.splice(key, 1);
                }
            });
        }

        vm.saveChanges = function () {
            var returnObj = {};
            returnObj.delete = vm.deletedScripts;

            var updatedScripts = [];
            var createdScripts = [];
            angular.forEach(vm.scripts, function (value) {
                if (value.status === 'added') {
                    createdScripts.push(value);
                }
                else if (value.status === 'updated') {
                    updatedScripts.push(value);
                }
            });
            returnObj.create = createdScripts;
            returnObj.update = updatedScripts;
            ScriptsResource.basic.saveAll(returnObj, function (data) {
                alert('Successfully Done!')
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

        vm.showScriptDialog = function (scriptId, ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                templateUrl: 'views/settings/dialogs/addScript.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                bindToController: true,
                fullscreen: useFullScreen,
                locals: { scriptId: scriptId },
                controller: DialogController,
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

            function DialogController($scope, $mdDialog, scriptId) {
                var script = {};
                var maxScriptId = 0;
                angular.forEach(vm.scripts, function (value, key) {
                    if (scriptId === value.scriptId) {
                        script = value;
                    }

                    if (maxScriptId < value.scriptId) {
                        maxScriptId = value.scriptId;
                    }
                });                

                var newScript = { scriptName: script.scriptName, scriptDesc: script.scriptDesc };
                $scope.script = newScript;
                
                $scope.addUpdateScript = function () {
                    if (scriptId > 0) {
                        script.scriptName = newScript.scriptName;
                        script.scriptDesc = newScript.scriptDesc;
                        if (script.status !== 'added') {
                            script.status = 'updated';
                        }
                    }
                    else {
                        newScript.scriptId = maxScriptId + 1;
                        newScript.scriptType = 'cmd';
                        newScript.scriptText = '';
                        newScript.status = 'added';
                        vm.scripts.push(newScript);
                    }

                    $mdDialog.hide();
                };

                $scope.closeScriptDialog = function () {
                    $mdDialog.cancel();
                };
            }

        }
    }
}());