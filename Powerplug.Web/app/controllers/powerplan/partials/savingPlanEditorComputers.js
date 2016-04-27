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
            };

            $scope.closePermissionDialog = function () {
                $mdDialog.cancel();
            };            
        }

    }
};