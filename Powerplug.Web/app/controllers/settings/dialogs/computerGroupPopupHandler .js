var computerGroupPopupHandler = {
    vm: {},
    init: function (vm, $mdDialog) {
        computerGroupPopupHandler.vm = vm;
        computerGroupPopupHandler.$mdDialog = $mdDialog;
    },
 
    openComputerGroupDialog: function (groupIndex) {
        return computerGroupPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/computerGroup.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {groupIndex: groupIndex},
            bindToController: true,
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, groupIndex) {
            //================Private============================
            var _editGroup;
            var _returnObjByPromise = { groupFields: {}}
            function init() {
                $scope.group = { groupName: '', groupDesc: '' }
                if (groupIndex >= 0) {
                    _editGroup = computerGroupPopupHandler.vm.computerGroups[groupIndex];
                    $scope.group.groupName = _editGroup.groupName;
                    $scope.group.groupDesc = _editGroup.groupDesc;
                } 
            }
           //=================scope binding========================
            $scope.isChange = false;
            $scope.closeDialog = function () {
                $mdDialog.cancel();
            };

            $scope.addUpdateGroup = function () {
                _returnObjByPromise.groupFields = {
                    groupName: $scope.group.groupName,
                    groupDesc: $scope.group.groupDesc
                }
                _returnObjByPromise.isChange = $scope.isChange;
                $mdDialog.hide({ groupObject: _returnObjByPromise });
            }
            //=======================init=========================
            init();
        }
    }
}