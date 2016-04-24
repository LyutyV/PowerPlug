var IPMaksPopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        IPMaksPopupHandler.vm = vm;
        IPMaksPopupHandler.$scope = $scope;
        IPMaksPopupHandler.$document = $document;
        IPMaksPopupHandler.$mdDialog = $mdDialog;
        IPMaksPopupHandler.$mdMedia = $mdMedia;
    },
 
    openIPMaskDialog: function (computerIndex) {
        IPMaksPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/IPMask.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            bindToController: true,
            locals: { computerIndex: computerIndex },
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, $document, computerIndex) {
            //===============private===============/
            var _selectedGroup;
            function addComputerObjectToJson(memberDef) {
                var computerObject;
                if (computerIndex >= 0) {
                    _selectedGroup.members[computerIndex].memberTypeId = $scope.memberTypeId;
                    _selectedGroup.members[computerIndex].memberDef = memberDef;
                }
                else {
                    //Add New
                    computerObject = {
                        "memberTypeId": $scope.memberTypeId,
                        "memberDef": memberDef,
                        "memberIncExc": true
                    }
                    _selectedGroup.members.push(computerObject)
                }
            }
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
            $scope.memberTypeId = 4;
            $scope.IP = { part1: null, part2: null, part3: null, part4: null}
            $scope.memberTypeOptions = [ { name: 'Equals', value: 4 }, { name: 'Not Equals', value: 6 }];
            $scope.add = function () {
                var memberDef;
                memberDef = $scope.IP.part1 + "." + $scope.IP.part2 + "." + $scope.IP.part3 + "." + $scope.IP.part4;
                addComputerObjectToJson(memberDef)
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.hide();
            }
            //===================Init=====================/
            init();
        }
    }
}