var IPRangePopupHandler = {
    vm: {},
    init: function (vm, $scope, $document, $mdDialog, $mdMedia) {
        IPRangePopupHandler.vm = vm;
        IPRangePopupHandler.$scope = $scope;
        IPRangePopupHandler.$document = $document;
        IPRangePopupHandler.$mdDialog = $mdDialog;
        IPRangePopupHandler.$mdMedia = $mdMedia;
    },
 
    openIPRangeDialog: function (computerIndex) {
      return IPRangePopupHandler.$mdDialog.show({
            templateUrl: 'views/settings/dialogs/IPRange.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            bindToController: true,
            locals: { computerIndex: computerIndex },
            controller: DialogController,
        });

        function DialogController($scope, $mdDialog, $document, computerIndex) {
          //===============private===============/
          var _selectedGroup;
          var _returnObjByPromise = { computerFields: {} };
          function init() {
             var IPFromArr, IPToArr, IPRangeArr;
              _selectedGroup = IPMaksPopupHandler.vm.groupMembersHash[IPMaksPopupHandler.vm.selectedGroupId];
              if (computerIndex >= 0) {
                $scope.memberTypeId = _selectedGroup.members[computerIndex].memberTypeId;
                IPRangeArr = _selectedGroup.members[computerIndex].memberDef.split('-', 2);
                IPFromArr = IPRangeArr[0].split('.', 4);
                $scope.IPFrom.part1 = IPFromArr[0];
                $scope.IPFrom.part2 = IPFromArr[1];
                $scope.IPFrom.part3 = IPFromArr[2];
                $scope.IPFrom.part4 = IPFromArr[3];
                IPToArr = IPRangeArr[1].split('.', 4);
                $scope.IPTo.part1 = IPToArr[0];
                $scope.IPTo.part2 = IPToArr[1];
                $scope.IPTo.part3 = IPToArr[2];
                $scope.IPTo.part4 = IPToArr[3];
            }
        }
        //=============Scope Binding=============/  
        $scope.isChange = false;
        $scope.IPFrom = { part1: null, part2: null, part3: null, part4: null }
        $scope.IPTo = { part1: null, part2: null, part3: null, part4: null }
        $scope.add = function () {
            var memeberDef = $scope.IPFrom.part1 + "." + $scope.IPFrom.part2 + "." + $scope.IPFrom.part3 + "." + $scope.IPFrom.part4 + " - "
            + $scope.IPTo.part1 + "." + $scope.IPTo.part2 + "." + $scope.IPTo.part3 + "." + $scope.IPTo.part4;
            _returnObjByPromise.computerFields = {
                "memberTypeId": 3,
                "memberDef": memeberDef,
                "memberIncExc": true
            }
            _returnObjByPromise.isChange = $scope.isChange;
            $mdDialog.hide({ computerObject: _returnObjByPromise });
        }
        $scope.cancel = function () {
            $mdDialog.cancel();
        }
        //========================init========================
        init();
    }
    }
}