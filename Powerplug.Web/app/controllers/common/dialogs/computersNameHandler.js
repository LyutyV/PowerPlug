var computersNameDialodHandler = {
    init: function ($mdDialog, ComputersResource, ComputerGroupsResource) {
        computersNameDialodHandler.$mdDialog = $mdDialog;
        computersNameDialodHandler.ComputersResource = ComputersResource;
        computersNameDialodHandler.ComputerGroupsResource = ComputerGroupsResource;
    },
    addComputerDialog: function (computersArr, isPromise) {
        return computersNameDialodHandler.$mdDialog.show({
            templateUrl: 'views/common/dialogs/computerCondition.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            bindToController: true,
            locals: { computersArr: computersArr },
            controller: DialogController,
        });
      
        function DialogController($scope, $mdDialog, $document, computersArr) {
            computersNameDialodHandler.ComputersResource.query(function (data) {
                $scope.savingComputerList = data;
            }, function (err) {
                onError(err);
            });

            $scope.addSavingComputers = function () {
                angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
                    var newComputerName = value.getAttribute('data-name');
                    var isExist = false;
                    if (computersArr) {
                        angular.forEach(computersArr, function (valueContainer, keyContainer) {
                            if (valueContainer.name === newComputerName) {
                                isExist = true;
                            }
                        });
                    }
                    if (!isExist) {
                        if (!computersArr) {
                            computersArr = [];
                        }
                        computersArr.push({ name: newComputerName });
                    }
                });
                $mdDialog.hide();
            };
            $scope.closeSavingComputers = function () {
                $mdDialog.cancel();
            };
        }

    },
};