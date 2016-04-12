(function () {
    'use strict';
    angular
        .module('powerPlug').directive('applicationTab', ['$uibModal', function ($uibModal) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/applications.html',
                scope: {
                    jsonobject: '=',
                    worktype: '@',
                    saveEvent: '=' //Indcates there is no event that save the data to json .. every change is made will be made on the original json
                },
                link: function (scope, element, attrs) {
                    //copy array appMetrics - init
                    if (!scope.saveEvent) {
                        scope.$watch('jsonobject', function (newValue, oldValue) {
                            if (typeof (newValue) != 'undefined') {
                                if (typeof (newValue.appMetrics) == 'undefined') {
                                    newValue.appMetrics = [];
                                }
                            scope.appMetrics = newValue.appMetrics;
                            }
                        });
                    }else if (typeof (scope.jsonobject) != 'undefined') {
                        //Deep Copy -- only on saveSettings event the json would change
                        scope.appMetrics = jQuery.extend(true, [], scope.jsonobject.appMetrics);
                    }
                    scope.addSavingApplication = function (ev, appId, type) {
                        var appMetric = { appKey: scope.appMetrics.length };
                        angular.forEach(scope.appMetrics, function (value, key) {
                            if (appId === value.appKey) {
                                appMetric = value;
                            }
                        });
                        
                        $uibModal.open({
                            templateUrl: 'views/powerplan/dialogs/applicationCondition.html',
                            resolve: { appMetric: function () { return appMetric;}},
                            controller: DialogController,
                        })

                        function DialogController($scope, $uibModalInstance, $document, appMetric) {
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
                                    threshold = angular.element('#cpuText')[0].value || 0;
                                    counter = 'Cpu';
                                }
                                else if (angular.element('#io')[0].checked) {
                                    threshold = (angular.element('#ioText')[0].value) * 1024;
                                    counter = 'Io';
                                }
                                if (scope.appMetrics && (appId < scope.appMetrics.length)) {
                                    appMetric.counter = counter;
                                    appMetric.appName = exeName;
                                    appMetric.threshold = threshold;
                                }
                                else {
                                    scope.appMetrics.push({ appKey: appId, appName: exeName, counter: counter, threshold: threshold });
                                }
                                $uibModalInstance.dismiss('OK');
                            };

                            $scope.closeSavingApplication = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    };
                    scope.removeSavingApplication = function (appId, type) {
                        angular.forEach(scope.appMetrics, function (value, key) {
                            if (appId === value.appKey) {
                                scope.appMetrics.splice(key, 1);           
                            }
                        });
                    };
                    //Save changes 
                    scope.$on('saveSettings', function (event, data) {
                        scope.jsonobject.appMetrics = jQuery.extend(true, [], scope.appMetrics);
                    });
            
                }
            }
        }])
}());