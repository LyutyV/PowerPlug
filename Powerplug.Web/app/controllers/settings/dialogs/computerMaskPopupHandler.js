var computerMaksPopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        computerMaksPopupHandler.vm = vm;
        computerMaksPopupHandler.$scope = $scope;
        computerMaksPopupHandler.$document = $document;
        computerMaksPopupHandler.$mdDialog = $mdDialog;
        computerMaksPopupHandler.$mdMedia = $mdMedia;
    },
 
    openComputerMaskDialog: function (ev) {
        computerMaksPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/computerMask.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            locals: {},
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, $document) {
            //===============private===============/
            function addComputerObjectToJson() {
                 var computerObject = {
                    "memberTypeId": $scope.MemberTypeId,
                    "memberDef": $scope.computerName,
                    "memberIncExc": true
                 }
                 computerMaksPopupHandler.vm.groupMembersHash[computerMaksPopupHandler.vm.selectedGroupId].members.push(computerObject)
            }
          //=============Scope Binding=============/  
            $scope.MemberTypeId = 2;
            $scope.memberTypeOptions = [{ name: 'is like', value: 2 }, { name: 'is not like', value: 5 }];
            $scope.computerName = null;
            $scope.add = function () {
                addComputerObjectToJson();
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.hide();
            }
        }
    }
}