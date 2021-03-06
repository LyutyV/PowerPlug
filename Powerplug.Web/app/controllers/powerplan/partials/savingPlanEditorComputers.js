var computersHandler = {
    vm: {},
    init: function (vm, $scope, $document, $uibModal, ComputersResource, ComputerGroupsResource) {
        computersHandler.vm = vm;
        computersHandler.$scope = $scope;
        computersHandler.$document = $document;
        computersHandler.$uibModal = $uibModal;
        computersHandler.ComputersResource = ComputersResource;
        computersHandler.ComputerGroupsResource = ComputerGroupsResource;
        computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);

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
    addComputerDialog: function (computersArr) {
        computersNameDialodHandler.addComputerDialog(computersArr, false);
    },
    addComputerGroupsDialog: function (ev) {
        computersHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/computerGroups.html',
            controller: DialogController,
            backdrop: 'static',
            size: 'large'
        });

        function DialogController($scope, $uibModalInstance, $document) {
            computersHandler.ComputerGroupsResource.groups.query(function (data) {
                $scope.computerGroupsList = data;
            }, function (err) {
                $scope.onError(err);
            });

            // tmp data to load
            $scope.computerGroupsList = [{
                computerGroup: 01,
                groupName: 'name01',
                groupGUID: 01,
                owner: 'owner01',
                groupDesc: 'desk01'
            }, {
                computerGroup: 02,
                groupName: 'name02',
                groupGUID: 02,
                owner: 'owner02',
                groupDesc: 'desk02'
            }];
            // end tmp data to load

            $scope.checkAll = function (seed) {
                switch (seed) {
                case 'groups':
                    {
                        if ($scope.selectedAllGroups) {
                            $scope.selectedAllGroups = true;
                        } else {
                            $scope.selectedAllGroups = false;
                        }
                        angular.forEach($scope.computerGroupsList, function (group) {
                            group.selected = $scope.selectedAllGroups;
                        });
                        break;
                    }
                default:
                    console.log('Error. Default value of select all group agr');
                }
            }

            $scope.onError = function (err) {
                console.log('Please, give me some data to addComputerGroups dialog. ' + err.statusText);
            }

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
                        computersHandler.vm.savingPlan.compGroups.push({
                            groupName: newComputerGroupName,
                            groupGUID: newComputerGroupId
                        });
                    }
                });

                $uibModalInstance.close();
            };

            $scope.closeComputerGroupsDialog = function () {
                $uibModalInstance.dismiss();
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
