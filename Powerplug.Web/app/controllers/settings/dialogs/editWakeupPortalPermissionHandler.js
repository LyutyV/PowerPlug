var editWakeupPermissionHandler = (function () {
    var api = {};
    var _uibModal;
    api.init = function ($uibModal, ComputersResource, ComputerGroupsResource) {
        _uibModal = $uibModal;
        computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);

    },

    api.openDialog = function (appMetric) {
        appMetric = 's';
        return _uibModal.open({
            templateUrl: 'views/settings/dialogs/editWakeupPortalPermission.html',
            resolve: { appMetric: function () { return appMetric;}},
            controller: DialogController,
            backdrop: 'static'
        });
        function DialogController($scope, $uibModalInstance, appMetric) {
            $scope.toValidate = false
            $scope.validateFields = function () {
                if ($scope.toValidate) {
                    if ($scope.editPermission.$error.required && $scope.editPermission.$error.required.length > 0) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Please Fill All Required Fields"
                    }
                    else {
                        $scope.isValide.error = false;
                    }
                 
                }
            }
            $scope.openDialog = function () {
                var computersArr = [];
                var model =computersNameDialodHandler.addComputerDialog(computersArr, true);
                model.result.then(function () {
                    if (computersArr.length > 0) {
                        debugger;
                        $scope.permission.computerName = computersArr[0].name;
                    }
                })
            }
            $scope.isValide = { error: false, message: "" };
            $scope.permission = {
                allow: 'allow',
                username: "",
                userDomain: "",
                computerName: "",
                computerDomain: ""
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };

            $scope.add = function () {
                $scope.toValidate = true;
                $scope.validateFields();
                if ($scope.isValide.error === false) {
                    $uibModalInstance.close();
                }
            }
            //=======================init=========================
        }
    }
    return api;
}());