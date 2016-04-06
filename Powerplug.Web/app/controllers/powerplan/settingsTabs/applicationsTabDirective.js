(function () {
    'use strict';
    angular
        .module('powerPlug').directive('applicationTab', ['$mdDialog', '$mdMedia', function ($mdDialog, $mdMedia) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/applications.html',
                scope: {
                    jsonobject: '=',
                    worktype: '='
                },
                link: function (scope, element, attrs) {
                    scope.addSavingApplication = function (ev, appId, type) {
                        var appMetric = { appKey: scope.jsonobject.appMetrics.length };
                        angular.forEach(scope.jsonobject.appMetrics, function (value, key) {
                            if (appId === value.appKey) {
                                appMetric = value;
                            }
                        });

                        $mdDialog.show({
                            templateUrl: 'views/powerplan/dialogs/applicationCondition.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: false,
                            bindToController: true,
                            fullscreen: $mdMedia('xs') || $mdMedia('sm'), /* TODO: useFullScreen,*/
                            locals: { appMetric: appMetric },
                            controller: DialogController,
                        });
                        scope.$watch(function () {
                            return $mdMedia('xs') || $mdMedia('sm');
                        }, function (wantsFullScreen) {
                            scope.customFullscreen = (wantsFullScreen === true);
                        });

                        function DialogController($scope, $mdDialog, $document, appMetric) {
                            $scope.appMetric = appMetric;
                            $scope.copyExeName = function (fileEl) {
                                var fileName = fileEl.value;
                                var lastIndex = fileName.lastIndexOf("\\");
                                if (lastIndex >= 0) {
                                    fileName = fileName.substring(lastIndex + 1).replace('.exe', '');
                                }
                                angular.element('#exeName')[0].value = fileName;
                            };

                            $scope.upsertSavingApplication = function (appId) {
                                var exeName = angular.element('#exeName')[0].value;
                                var counter;
                                var threshold = 0;

                                if (angular.element('#running')[0].checked) {
                                    counter = 'Running';
                                }
                                else if (angular.element('#cpu')[0].checked) {
                                    threshold = angular.element('#cpuText')[0].value;
                                    counter = 'Cpu';
                                }
                                else if (angular.element('#io')[0].checked) {
                                    threshold = (angular.element('#ioText')[0].value) * 1024;
                                    counter = 'Io';
                                }
                                if (appId < scope.jsonobject.appMetrics.length) {
                                    appMetric.counter = counter;
                                    appMetric.appName = exeName;
                                    appMetric.threshold = threshold;
                                }
                                else {
                                    scope.jsonobject.appMetrics.push({ appKey: appId, appName: exeName, counter: counter, threshold: threshold });
                                }
                                $mdDialog.hide();
                            };

                            $scope.closeSavingApplication = function () {
                                $mdDialog.cancel();
                            };
                        }
                    };
                    scope.removeSavingApplication = function (appId, type) {
                        angular.forEach(scope.jsonobject.appMetrics, function (value, key) {
                            if (appId === value.appKey) {
                                scope.jsonobject.appMetrics.splice(key, 1);
                            }
                        });
                    };
            
                }
            }
        }])
}());