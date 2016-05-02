var computersNameDialodHandler = {
    init: function ($uibModal, ComputersResource, ComputerGroupsResource) {
        computersNameDialodHandler.$uibModal = $uibModal;
        computersNameDialodHandler.ComputersResource = ComputersResource;
        computersNameDialodHandler.ComputerGroupsResource = ComputerGroupsResource;
    },
    addComputerDialog: function (computersArr, isPromise) {
        return computersNameDialodHandler.$uibModal.open({
            templateUrl: 'views/common/dialogs/computerCondition.html',
            resolve: { computersArr: function () { return  computersArr } },
            controller: DialogController,
            size: 'large',
            backdrop: 'static'
        });
      
        function DialogController($scope, $uibModalInstance, $document, computersArr) {
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
                $uibModalInstance.close('Add');
            };
            $scope.closeSavingComputers = function () {
                $uibModalInstance.dismiss();
            };
        }

    },
};