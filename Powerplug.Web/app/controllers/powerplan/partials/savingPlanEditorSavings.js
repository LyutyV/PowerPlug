function setSavingItems(vm) {
    if (vm.savingPlan.savings.work.options) {
        vm.savingPlan.savings.work.options.computerMetricsConverted = {};
        angular.forEach(vm.savingPlan.savings.work.options.computerMetrics, function (value, key) {
            vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter] = value;
            vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].thresholdInKb = vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].threshold / 1024;
        });
        angular.forEach(vm.savingPlan.savings.work.options.appMetrics, function (value, key) {
            value.appKey = key;
        });

        angular.forEach(vm.savingPlan.savings.work.options.computersNotRun, function (value, key) {
            value.computerKey = key;
        });
    }
    if (vm.savingPlan.savings.nonWork.options) {
        vm.savingPlan.savings.nonWork.options.computerMetricsConverted = {};
        angular.forEach(vm.savingPlan.savings.nonWork.options.computerMetrics, function (value, key) {
            vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter] = value;
            vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].thresholdInKb = vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].threshold / 1024;

        });
        angular.forEach(vm.savingPlan.savings.nonWork.options.appMetrics, function (value, key) {
            value.appKey = key;
        });
        angular.forEach(vm.savingPlan.savings.nonWork.options.computersNotRun, function (value, key) {
            value.computerKey = key;
        });
    }
}

function updateSavingItems(vm, $document) {
    if (vm.savingPlan.savings.work.options && vm.savingPlan.savings.work.options.computerMetricsConverted) {
        setComputerMetrics('Cpu', 'work', 1);
        setComputerMetrics('Io', 'work', 1024);
        setComputerMetrics('Network', 'work', 1024);
    }
    if (vm.savingPlan.savings.nonWork.options && vm.savingPlan.savings.nonWork.options.computerMetricsConverted) {
        setComputerMetrics('Cpu', 'nonWork', 1);
        setComputerMetrics('Io', 'nonWork', 1024);
        setComputerMetrics('Network', 'nonWork', 1024);
    }

    function setComputerMetrics(id, type, multiplyNumber) {
        var chkElement = $document[0].querySelector('#' + type + id);
        var txtElement = $document[0].querySelector('#' + type + id + 'Text');
        var isElementFound = false;
        if (!vm.savingPlan.savings[type].options.computerMetrics) {
            vm.savingPlan.savings[type].options.computerMetrics = [];
        }

        if (chkElement.checked) {
            angular.forEach(vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                if (value.counter === id) {
                    isElementFound = true;
                    value.threshold = Number(txtElement.value) * multiplyNumber;
                }
            });

            if (!isElementFound) {
                if (!vm.savingPlan.savings[type].options.computerMetrics) {
                    vm.savingPlan.savings[type].options.computerMetrics = [];
                }
                vm.savingPlan.savings[type].options.computerMetrics.push({ counter: id, threshold: (Number(txtElement.value) * multiplyNumber) });
            }
        }
        else {
            angular.forEach(vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                if (value.counter === id) {
                    vm.savingPlan.savings[type].options.computerMetrics.splice(key, 1);
                    vm.savingPlan.savings[type].options.computerMetricsConverted.splice(value.counter, 1);
                }
            });
        }
    }
}

function setSavingEvents(vm, $scope, $document, $mdMedia, $mdDialog, ComputersResource) {
    vm.addSavingComputer = savingComputerDialog;
    function savingComputerDialog(ev, computerId, type) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/computerCondition.html',
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
            ComputersResource.query(function (data) {
                $scope.savingComputerList = data;
            }, function (err) {
                onError(err);
            });

            $scope.addSavingComputers = function () {
                angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
                    var newComputerName = value.getAttribute('data-name');
                    var isExist = false;
                    if (vm.savingPlan.savings[type].options && vm.savingPlan.savings[type].options.computersNotRun) {
                        angular.forEach(vm.savingPlan.savings[type].options.computersNotRun, function (valueContainer, keyContainer) {
                            if (valueContainer.name === newComputerName) {
                                isExist = true;
                            }
                        });
                    }

                    if (!isExist) {
                        if (!vm.savingPlan.savings[type].options) {
                            vm.savingPlan.savings[type].options = {};
                        }

                        if (!vm.savingPlan.savings[type].options.computersNotRun) {
                            vm.savingPlan.savings[type].options.computersNotRun = [];
                        }
                        vm.savingPlan.savings[type].options.computersNotRun.push({ computerKey: vm.savingPlan.savings[type].options.computersNotRun.length, name: newComputerName });
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

