var IPMaksPopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        IPMaksPopupHandler.vm = vm;
        IPMaksPopupHandler.$scope = $scope;
        IPMaksPopupHandler.$document = $document;
        IPMaksPopupHandler.$mdDialog = $mdDialog;
        IPMaksPopupHandler.$mdMedia = $mdMedia;
    },
 
    openIPMaskDialog: function (ev) {
        IPMaksPopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/IPMask.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController: true,
            locals: {},
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, $document) {
            //===============private===============/
            function addComputerObjectToJson(memeberDef) {
                 var computerObject = {
                    "memberTypeId": $scope.MemberTypeId,
                    "memberDef": memeberDef,
                    "memberIncExc": true
                 }
                 IPMaksPopupHandler.vm.groupMembersHash[IPMaksPopupHandler.vm.selectedGroupId].members.push(computerObject)
            }
          //=============Scope Binding=============/  
            $scope.MemberTypeId = 4;
            $scope.IP = { part1: null, part2: null, part3: null, part4: null}
            $scope.memberTypeOptions = [ { name: 'Equals', value: 4 }, { name: 'Not Equals', value: 6 }];
            $scope.add = function () {
                var memeberDef;
                memeberDef = $scope.IP.part1 + "." + $scope.IP.part2 + "." + $scope.IP.part3 + "." + $scope.IP.part4;
                addComputerObjectToJson(memeberDef)
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.hide();
            }
        }
    }
}