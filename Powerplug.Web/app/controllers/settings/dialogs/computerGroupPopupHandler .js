var computerGroupPopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        computerGroupPopupHandler.vm = vm;
        computerGroupPopupHandler.$scope = $scope;
        computerGroupPopupHandler.$document = $document;
        computerGroupPopupHandler.$mdDialog = $mdDialog;
        computerGroupPopupHandler.$mdMedia = $mdMedia;
    },
 
    openComputerGroupDialog: function (groupIndex) {
        computerGroupPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/computerGroup.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {groupIndex: groupIndex},
            bindToController: true,
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, $document, groupIndex) {
            //================Private============================
            var _editGroup = 0;
            function init() {
                if (groupIndex > 0) {
                    _editGroup = computerGroupPopupHandler.vm.computerGroups[groupIndex];
                    $scope.group.groupName = _editGroup.groupName;
                    $scope.group.groupDesc = _editGroup.groupDesc;
                } else {
                    $scope.group = { groupName: '', groupDesc: '', members: [], permissions: [] };
                }
            }
             
           //=================scope binding========================
            $scope.closeDialog = function () {
                $mdDialog.cancel();
            };

            $scope.addUpdateGroup = function () {
                if (groupIndex > 0) {
                    //update _editGroup will update json
                    _editGroup.groupName = $scope.group.groupName;
                    _editGroup.groupDesc = $scope.group.groupDesc;
                }
                else {
                    computerGroupPopupHandler.vm.maxGroupId = computerGroupPopupHandler.vm.maxGroupId + 1
                    var newGroup = {
                        groupName: $scope.group.groupName,
                        groupDesc: $scope.group.groupDesc,
                        compGroupId: computerGroupPopupHandler.vm.maxGroupId
                    };
                    computerGroupPopupHandler.vm.computerGroups.push(newGroup);
                    computerGroupPopupHandler.vm.groupMembersHash[computerGroupPopupHandler.vm.maxGroupId] = newGroup;
                    computerGroupPopupHandler.vm.groupMembersHash[computerGroupPopupHandler.vm.maxGroupId].members = [];
                }
                $mdDialog.hide();
            }
            //=======================init=========================
            init();
        }
    }
}