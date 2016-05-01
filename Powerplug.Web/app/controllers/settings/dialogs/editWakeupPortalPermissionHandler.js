﻿var editWakeupPermissionHandler = (function () {
    var api = {};
    var _mdDialog;
    api.init = function ($mdDialog) {
        _mdDialog = $mdDialog;
    },

    api.openDialog = function () {
        return _mdDialog.show({
            templateUrl: 'views/settings/dialogs/editWakeupPortalPermission.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            bindToController: true,
            controller: DialogController,
        });
        function DialogController($scope, $mdDialog) {
            $scope.toValidate = false
            $scope.validateFields = function () {
                if ($scope.toValidate) {
                    if ($scope.newUser.$error.required && $scope.newUser.$error.required.length > 0) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Please Fill All Required Fields"
                    }
                    else if ($scope.newUser.password.$error.required === undefined && $scope.newUser.password.$error.minlength) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Password must be at least 6 characters"
                    }
                    else if ($scope.user.password != $scope.user.confirmPassword) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Passwords doesn't match"
                        $scope.newUser.password.$error.match = true;
                        $scope.newUser.confirmPassword.$error.match = true;
                    } else {
                        $scope.isValide = { error: false, message: "" };
                        delete $scope.newUser.password.$error['match'];
                        delete $scope.newUser.confirmPassword.$error['match'];

                    }
                }
            }
            $scope.isValide = { error: false, message: "" };
            $scope.permission = { allow: 'allow' ,username: "", userDomain: "", compName: "", compDomain: "" };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.add = function () {
                $scope.toValidate = true;
                $scope.validateFields();
                if ($scope.isValide.error === false) {
                    $mdDialog.hide();
                }
            }
            //=======================init=========================

        }
    }
    return api;
}());