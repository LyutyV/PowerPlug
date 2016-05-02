var editWakeupPermissionHandler = (function () {
    var api = {};
    var _uibModal;
    api.init = function ($uibModal) {
        _uibModal = $uibModal;
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
                _uibModal.open({
                    templateUrl: 'views/settings/dialogs/tempDialog1.html',
                    controller: DialogController1,
                    backdrop: 'static'
                });
                function DialogController1($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss();
                    };

                    $scope.add = function () {
                        $uibModalInstance.dismiss();
                    }
                    $scope.openDialog = function () {
                        _uibModal.open({
                            templateUrl: 'views/settings/dialogs/tempDialog2.html',
                            controller: DialogController2,
                            backdrop: 'static'
                        });
                        function DialogController2($scope, $uibModalInstance) {
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss();
                            };

                            $scope.add = function () {
                                $uibModalInstance.dismiss();
                            }
                        }

                    }

                }
            }
            $scope.isValide = { error: false, message: "" };
            $scope.permission = { allow: 'allow' ,username: "", userDomain: "", compName: "", compDomain: "" };
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