var IPMaksPopupHandler = {
    vm: {},
    init: function (vm, $mdDialog) {
        IPMaksPopupHandler.vm = vm;
        IPMaksPopupHandler.$mdDialog = $mdDialog;
    },
 
    openIPMaskDialog: function (computerIndex) {
        return IPMaksPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/IPMask.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            bindToController: true,
            locals: { computerIndex: computerIndex },
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, computerIndex) {
            //===============private===============/
            var _selectedGroup;
            var _returnObjByPromise = { computerFields: {} };
            function init() {
                var IPAdressArr;
                _selectedGroup = IPMaksPopupHandler.vm.groupMembersHash[IPMaksPopupHandler.vm.selectedGroupId];
                if (computerIndex >= 0) {
                    $scope.memberTypeId = _selectedGroup.members[computerIndex].memberTypeId;
                    IPAdressArr = _selectedGroup.members[computerIndex].memberDef.split('.', 4);
                    $scope.IP.part1 = IPAdressArr[0];
                    $scope.IP.part2 = IPAdressArr[1];
                    $scope.IP.part3 = IPAdressArr[2];
                    $scope.IP.part4 = IPAdressArr[3];
                } 
            }
            //=============Scope Binding=============/ 
            $scope.isChange = false;
            $scope.memberTypeId = 4;
            $scope.IP = { part1: null, part2: null, part3: null, part4: null}
            $scope.memberTypeOptions = [ { name: 'Equals', value: 4 }, { name: 'Not Equals', value: 6 }];
            $scope.add = function () {
                var memberDef;
                memberDef = $scope.IP.part1 + "." + $scope.IP.part2 + "." + $scope.IP.part3 + "." + $scope.IP.part4;
                _returnObjByPromise.computerFields = {
                    "memberTypeId": $scope.memberTypeId,
                    "memberDef": memberDef,
                }
                _returnObjByPromise.isChange = $scope.isChange;
                $mdDialog.hide({ computerObject: _returnObjByPromise });
            }
            $scope.cancel = function () {
                $mdDialog.cancel()
            }
            //===================Init=====================/
            init();
        }
    }
}