/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ComputerGroupsCtrl',
                     ['$scope', '$mdDialog', '$mdMedia','$state', '$document','ComputersResource', 'ComputerGroupsResource', ComputerGroupsCtrl]);


    function ComputerGroupsCtrl($scope, $mdDialog, $mdMedia, $state, $document,ComputersResource, ComputerGroupsResource) {
        //============Private===========================================
        var vm = this;
        function initGroupMembersHash() {
            vm.maxGroupId = 0;
            //case of unselected group 
            vm.groupMembersHash[-1] = { 'members': [] }
            //init hash object with all computers group ids
            vm.computerGroups.forEach(function (groupItem, index, array) {
                vm.groupMembersHash[groupItem.compGroupId] = {};
                if (vm.maxGroupId < groupItem.compGroupId) {
                    vm.maxGroupId = groupItem.compGroupId;
                }
            });
        }
        function initPopups() {
            IPMaksPopupHandler.init(vm, $scope, $document, $mdDialog, $mdMedia);
            computerMaksPopupHandler.init(vm, $scope, $document, $mdDialog, $mdMedia);
            IPRangePopupHandler.init(vm, $scope, $document, $mdDialog);

            computerGroupPopupHandler.init(vm, $scope, $document, $mdDialog, $mdMedia);
            vm.openComputerGroupDialog = computerGroupPopupHandler.openComputerGroupDialog;
            }

            function isEmpty(object) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            }
            function onError(err) {
                console.log(err)
                if (err.status === 401 || err.status === -1) {
                    $state.go('login');
                }
            }

            function onSuccess(data) {
                console.log(data);
                vm.groupMembersHash[data.compGroupId] = data;
            }
            //=======================vm Binding====================================
            vm.selectedGroupIndex = -1;
            vm.selectedGroupId = -1;
            vm.popupType = 'computerName';
            vm.popupTypeOptions = [{ name: 'Computer Name', value: 'computerName' }, { name: 'Computer Mask', value: 'computerMask' },
                { name: 'IP Mask', value: 'IPMask' }, { name: 'IP Range', value: 'IPRange' }];
            vm.groupMembersHash = {};
            vm.getComputerDefinitionText = function (computerObj) {
                var defenitionText;
                switch (computerObj.memberTypeId) {
                    case 1:
                        defenitionText = computerObj.memberDef;
                        break;
                    case 2:
                        defenitionText = '[Computer Name] like ' + computerObj.memberDef;
                        break;
                    case 3:
                        defenitionText = '[IP Address] in ' + computerObj.memberDef;
                        break;
                    case 4:
                        defenitionText = '[IP Address] like ' + computerObj.memberDef;
                        break;
                    case 5:
                        defenitionText = '[Computer Name] not like ' + computerObj.memberDef;
                        break;
                    case 6:
                        defenitionText = '[IP Address] not like ' + computerObj.memberDef;
                        break;
                }
                return defenitionText;
            }
            ComputerGroupsResource.groups.query(function (data) {
                vm.computerGroups = data;
                initGroupMembersHash();
                console.log(data);
            }, function (error) {
                if (error.status === 401 || error.status === -1)
                {                
                    $state.go('login');
                }
            });
                
            vm.selectComputerGroup = function ($index) {
                var groupId;
                vm.selectedGroupIndex = $index;
                groupId = typeof (vm.computerGroups[$index].compGroupId) === 'undefined' ? -1 : vm.computerGroups[$index].compGroupId;
                if (groupId > 0 && (isEmpty(vm.groupMembersHash[groupId]))) {
                    ComputerGroupsResource.groupMembers.get({ groupId: groupId }, function (data) {
                        onSuccess(data);
                    }, function (err) {
                        onError(err);
                    });
                }
                vm.selectedGroupId = groupId;
            }
        
            vm.openAddDialog = function (index) {
                var editPopupType = 0;
                if (index >= 0) {
                    editPopupType = vm.groupMembersHash[vm.selectedGroupId].members[index].memberTypeId;
                }
                if ('computerName' == vm.popupType && (index < 0)) {
                    IPMaksPopupHandler.openIPMaskDialog(index);
                }
                else if (('computerMask' == vm.popupType) || (editPopupType == 2) || (editPopupType == 5)){
                    computerMaksPopupHandler.openComputerMaskDialog(index);
                }
                else if (('IPMask' == vm.popupType) ||  (editPopupType == 4) || (editPopupType == 6)){
                    IPMaksPopupHandler.openIPMaskDialog(index);
                }
                else if (('IPRange' == vm.popupType) || (editPopupType == 3)) {
                    IPRangePopupHandler.openIPRangeDialog(index);
                  }
            };
        //===========init===================//
            initPopups()
    }
}());