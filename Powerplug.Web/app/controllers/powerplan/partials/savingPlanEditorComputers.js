var computersHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia, ComputersResource, ComputerGroupsResource) {
        computersHandler.vm = vm;
        computersHandler.$scope = $scope;
        computersHandler.$document = $document;
        computersHandler.$mdDialog = $mdDialog;
        computersHandler.$mdMedia = $mdMedia;
        computersHandler.ComputersResource = ComputersResource;
        computersHandler.ComputerGroupsResource = ComputerGroupsResource;
    },
    setComputerItems: function () {
        computersHandler.vm.computersFromDB = [];
        computersHandler.vm.computerGroupsFromDB = [];
        if (computersHandler.vm.savingPlan.computers) {
            angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
                computersHandler.vm.computersFromDB.push(valueComputer);
            });
        }
        if (computersHandler.vm.savingPlan.compGroups) {
            angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueComputerGroup, keyComputerGroup) {
                computersHandler.vm.computerGroupsFromDB.push(valueComputerGroup);
            });
        }
    },
    addComputerDialog: function (ev) {
        computersHandler.$mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/computerCondition.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            fullscreen: computersHandler.$mdMedia('xs') || computersHandler.$mdMedia('sm'), /* TODO: useFullScreen,*/
            locals: {},
            controller: DialogController,
        });
        computersHandler.$scope.$watch(function () {
            return computersHandler.$mdMedia('xs') || computersHandler.$mdMedia('sm');
        }, function (wantsFullScreen) {
            computersHandler.$scope.customFullscreen = (wantsFullScreen === true);
        });

        function DialogController($scope, $mdDialog, $document) {
            computersHandler.ComputersResource.query(function (data) {
                $scope.savingComputerList = data;
            }, function (err) {
                onError(err);
            });

            $scope.addSavingComputers = function () {
                angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
                    var newComputerName = value.getAttribute('data-name');
                    var isExist = false;
                    if (computersHandler.vm.savingPlan.computers) {
                        angular.forEach(computersHandler.vm.savingPlan.computers, function (valueContainer, keyContainer) {
                            if (valueContainer.name === newComputerName) {
                                isExist = true;
                            }
                        });
                    }

                    if (!isExist) {
                        if (!computersHandler.vm.savingPlan.computers) {
                            computersHandler.vm.savingPlan.computers = [];
                        }
                        computersHandler.vm.savingPlan.computers.push({ name: newComputerName });
                    }
                });

                $mdDialog.hide();
            };

            $scope.closeSavingComputers = function () {
                $mdDialog.cancel();
            };
        }

    },
    addComputerGroupsDialog: function (ev) {
        computersHandler.$mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/computerGroups.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            fullscreen: computersHandler.$mdMedia('xs') || computersHandler.$mdMedia('sm'), /* TODO: useFullScreen,*/
            locals: {},
            controller: DialogController,
        });
        computersHandler.$scope.$watch(function () {
            return computersHandler.$mdMedia('xs') || computersHandler.$mdMedia('sm');
        }, function (wantsFullScreen) {
            computersHandler.$scope.customFullscreen = (wantsFullScreen === true);
        });

        function DialogController($scope, $mdDialog, $document) {
            computersHandler.ComputerGroupsResource.groups.query(function (data) {
                $scope.computerGroupsList = data;
            }, function (err) {
                onError(err);
            });

            $scope.addComputerGroups = function () {
                angular.forEach(angular.element('.computer-group-selection:checked'), function (value, key) {
                    var newComputerGroupId = value.getAttribute('data-id');
                    var newComputerGroupName = value.getAttribute('data-name');
                    var isExist = false;
                    if (computersHandler.vm.savingPlan.compGroups) {
                        angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueContainer, keyContainer) {
                            if (valueContainer.groupGUID === newComputerGroupId) {
                                isExist = true;
                            }
                        });
                    }

                    if (!isExist) {
                        if (!computersHandler.vm.savingPlan.compGroups) {
                            computersHandler.vm.savingPlan.compGroups = [];
                        }
                        computersHandler.vm.savingPlan.compGroups.push({ groupName: newComputerGroupName, groupGUID: newComputerGroupId });
                    }
                });

                $mdDialog.hide();
            };

            $scope.closeComputerGroupsDialog = function () {
                $mdDialog.cancel();
            };            
        }

    },
    removeComputerGroups: function () {        
        angular.forEach(angular.element('.computer-group-selection:checked'), function (value, key) {
            var computerGroupId = value.getAttribute('data-id');
            angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueCompGroup, keyCompGroup) {
                if (computerGroupId === valueCompGroup.groupGUID) {
                    computersHandler.vm.savingPlan.compGroups.splice(keyCompGroup, 1);                   
                }
            });
        });        
    },
    removeComputers: function () {
        angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
            var computerName = value.getAttribute('data-name');
            angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
                if (computerName === valueComputer.name) {
                    computersHandler.vm.savingPlan.computers.splice(keyComputer, 1);
                }
            });
        });
    },
    prepareComputersDelta: function () {
        addedComputers = [];
        removedComputers = [];

        angular.forEach(computersHandler.vm.computersFromDB, function (valueDB, keyDB) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
                if (valueComputer.name === valueDB.name) {
                    isItemExist = true;                    
                }
            });
            if (!isItemExist) {
                removedComputers.push(valueDB);
            }
        });

        angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {        
            var isItemExist = false;
            angular.forEach(computersHandler.vm.computersFromDB, function (valueDB, keyDB) {
                if (valueComputer.name === valueDB.name) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                addedComputers.push(valueComputer);
            }
        });
        
        computersHandler.vm.savingPlan.addComputers = addedComputers;
        computersHandler.vm.savingPlan.removeComputers = removedComputers;
    },
    prepareComputerGroupsDelta: function () {
        addedComputerGroups = [];
        removedComputerGroups = [];

        angular.forEach(computersHandler.vm.computerGroupsFromDB, function (valueDB, keyDB) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueComputerGroup, keyComputerGroup) {
                if (valueComputerGroup.groupGUID === valueDB.groupGUID) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                removedComputerGroups.push(valueDB);
            }
        });

        angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueComputerGroup, keyComputerGroup) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.computerGroupsFromDB, function (valueDB, keyDB) {
                if (valueComputerGroup.groupGUID === valueDB.groupGUID) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                addedComputerGroups.push(valueComputerGroup);
            }
        });

        computersHandler.vm.savingPlan.addCompGroups = addedComputerGroups;
        computersHandler.vm.savingPlan.removeCompGroups = removedComputerGroups;
    }
};