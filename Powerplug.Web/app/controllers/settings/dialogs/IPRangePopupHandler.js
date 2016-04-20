var IPRangePopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        IPRangePopupHandler.vm = vm;
        IPRangePopupHandler.$scope = $scope;
        IPRangePopupHandler.$document = $document;
        IPRangePopupHandler.$mdDialog = $mdDialog;
        IPRangePopupHandler.$mdMedia = $mdMedia;
    },
 
    openIPRangeDialog: function (ev) {
        IPRangePopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/IPRange.html',
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
                    "memberTypeId": 3,
                    "memberDef": memeberDef,
                    "memberIncExc": true
                 }
                 IPRangePopupHandler.vm.groupMembersHash[IPRangePopupHandler.vm.selectedGroupId].members.push(computerObject)
            }
          //=============Scope Binding=============/  
            $scope.IPFrom = { part1: null, part2: null, part3: null, part4: null }
            $scope.IPTo = { part1: null, part2: null, part3: null, part4: null }
            $scope.add = function () {
                var memeberDef = $scope.IPFrom.part1 + "." + $scope.IPFrom.part2 + "." + $scope.IPFrom.part3 + "." + $scope.IPFrom.part4 + " - "
                + $scope.IPTo.part1 + "." + $scope.IPTo.part2 + "." + $scope.IPTo.part3 + "." + $scope.IPTo.part4;
                addComputerObjectToJson(memeberDef)
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.hide();
            }
        }
    }
}