(function () {
    'use strict';
    angular
        .module('powerPlug').directive('computersTab', ['$mdDialog', 'ComputersResource', function ($mdDialog, ComputersResource) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/computers.html',     
                scope: {
                    jsonobject: '='
                },
                link: function (scope, element, attrs) {
                    //private
                    function onError(err) {
                        console.log(err)
                        if (err.status === 401 || err.status === -1) {
                            $state.go('login');
                        }
                    }

                    //scope
                    scope.removeSavingComputer = function (computerId, type) {
                        angular.forEach(scope.jsonobject.computersNotRun, function (value, key) {
                            if (computerId === value.computerKey) {
                                scope.jsonobject.computersNotRun.splice(key, 1);
                            }
                        });
                    };

                    scope.addSavingComputer = function (ev, computerId, type) {
                        $mdDialog.show({
                            templateUrl: 'views/powerplan/dialogs/computerCondition.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: false,
                            bindToController: true,
                            locals: {},
                            controller: DialogController,
                        });
                       
                        function DialogController($scope, $mdDialog, $document) {
                            ComputersResource.query(function (data) {
                                $scope.savingComputerList = data;
                            }, function (err) {
                                onError(err);
                            });

                            $scope.addSavingComputers = function () {
                                angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
                                    var newComputerName = value.getAttribute('data-name');
                                    var isExist = false;
                                    if (scope.jsonobject && scope.jsonobject.computersNotRun) {
                                        angular.forEach(scope.jsonobject.computersNotRun, function (valueContainer, keyContainer) {
                                            if (valueContainer.name === newComputerName) {
                                                isExist = true;
                                            }
                                        });
                                    }

                                    if (!isExist) {
                                        if (!scope.jsonobject) {
                                            scope.jsonobject = {};
                                        }

                                        if (!scope.jsonobject.computersNotRun) {
                                            scope.jsonobject.computersNotRun = [];
                                        }
                                        scope.jsonobject.computersNotRun.push({ computerKey: scope.jsonobject.computersNotRun.length, name: newComputerName });
                                    }
                                });

                                $mdDialog.hide();
                            };

                            $scope.closeSavingComputers = function () {
                                $mdDialog.cancel();
                            };
                        }
                    };
                }
            }
        }])
}());