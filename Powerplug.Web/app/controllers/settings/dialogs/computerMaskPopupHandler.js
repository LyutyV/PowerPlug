var computerMaksPopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        computerMaksPopupHandler.vm = vm;
        computerMaksPopupHandler.$scope = $scope;
        computerMaksPopupHandler.$document = $document;
        computerMaksPopupHandler.$mdDialog = $mdDialog;
        computerMaksPopupHandler.$mdMedia = $mdMedia;
    },
 
    openComputerMaskDialog: function (computerIndex) {
        computerMaksPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/computerMask.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            bindToController: true,
            locals: { computerIndex: computerIndex }, 
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, $document, computerIndex) {
            //===============private===============/
            var _selectedGroup;
            function addComputerObjectToJson() {
                var computerObject;
                if (computerIndex => 0) {
                    _selectedGroup.members[computerIndex].memberDef = $scope.computerName;
                    _selectedGroup.members[computerIndex].memberTypeId = $scope.memberTypeId ;
                }
                else {
                    computerObject = {
                        "memberTypeId": $scope.memberTypeId,
                        "memberDef": $scope.computerName,
                        "memberIncExc": true
                    }
                    _selectedGroup.members.push(computerObject)
                }
            }
            function init() {
                _selectedGroup = computerMaksPopupHandler.vm.groupMembersHash[computerMaksPopupHandler.vm.selectedGroupId];
                if (computerIndex => 0) {
                    $scope.computerName = _selectedGroup.members[computerIndex].memberDef;
                    $scope.memberTypeId = _selectedGroup.members[computerIndex].memberTypeId;
                }
            }
            //=============Scope Binding=============/  
            
            $scope.memberTypeId = 2;
            $scope.memberTypeOptions = [{ name: 'is like', value: 2 }, { name: 'is not like', value: 5 }];
            $scope.computerName = null;
            $scope.add = function () {
                addComputerObjectToJson();
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.hide();
            }
            //===============init================/
            init();
        }
    }
}