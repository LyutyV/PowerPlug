var permissionHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        permissionHandler.vm = vm;
        permissionHandler.$scope = $scope;
        permissionHandler.$document = $document;
        permissionHandler.$mdDialog = $mdDialog;
        permissionHandler.$mdMedia = $mdMedia;
    },
    addPermissionsDialog: function (ev) {
        permissionHandler.$mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/addPermission.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            fullscreen: permissionHandler.$mdMedia('xs') || permissionHandler.$mdMedia('sm'), /* TODO: useFullScreen,*/
            locals: {},
            controller: DialogController,
        });
        permissionHandler.$scope.$watch(function () {
            return permissionHandler.$mdMedia('xs') || permissionHandler.$mdMedia('sm');
        }, function (wantsFullScreen) {
            permissionHandler.$scope.customFullscreen = (wantsFullScreen === true);
        });

        function DialogController($scope, $mdDialog, $document) {
            $scope.addPermission = function () {
                $mdDialog.hide();
            }

            $scope.closePermissionDialog = function () {
                $mdDialog.cancel();
            }
            // Select all checkboxes function in add script dialog
            $scope.checkAll = function (seed) {
                    switch (seed) {
                    case 'users':
                        {
                            if ($scope.selectedAllUsers) {
                                $scope.selectedAllUsers = true;
                            } else {
                                $scope.selectedAllUsers = false;
                            }
                            angular.forEach($scope.users, function (user) {
                                user.selected = $scope.selectedAllUsers;
                            });
                            break;
                        }
                    default:
                        console.log('Error. Default value of select all (groups or comps) agr');
                    }
                }

            // End select all checkboxes function in add script dialog

            // tmp model for filling Add Permissions dialog
            $scope.users = [{
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }]

            // end tmp model for filling Add Permissions dialog

        }

    }
};
