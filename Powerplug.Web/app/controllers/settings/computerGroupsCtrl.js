/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ComputerGroupsCtrl',
                     ['$scope', '$mdDialog', '$mdMedia','$state', '$document', 'ComputerGroupsResource', ComputerGroupsCtrl]);


    function ComputerGroupsCtrl($scope, $mdDialog, $mdMedia, $state, $document, ComputerGroupsResource) {
        //============Private===========================================
        function initGroupMembersHash() {
            //case of unselected group 
            vm.groupMembersHash[-1] = { 'members': [] }
            //init hash object with all computers group ids
            vm.computerGroups.forEach(function (groupItem, index, array) {
                vm.groupMembersHash[groupItem.compGroupId] = {};
            });
        }
        function initPopups() {
            IPMaksPopupHandler.init(vm, $scope, $document, $mdDialog, $mdMedia);
            computerMaksPopupHandler.init(vm, $scope, $document, $mdDialog, $mdMedia);
            IPRangePopupHandler.init(vm, $scope, $document, $mdDialog);
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
            var vm = this;
            vm.selectedGroupIndex = -1;
            vm.selectedGroupId = -1;
            vm.popupType = 'computerName';
            vm.popupTypeOptions = [{ name: 'Computer Name', value: 'computerName' }, { name: 'Computer Mask', value: 'computerMask' },
                { name: 'IP Mask', value: 'IPMask' }, { name: 'IP Range', value: 'IPRange' }];
            vm.groupMembersHash = {};
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
                groupId = vm.computerGroups[$index].compGroupId;
                if (isEmpty(vm.groupMembersHash[groupId])){
                    ComputerGroupsResource.groupMembers.get({ groupId: groupId }, function (data) {
                        onSuccess(data);
                    }, function (err) {
                        onError(err);
                    });
                }
                vm.selectedGroupId = groupId;
            }
        
            vm.openAddDialog = function () {
                switch( vm.popupType) {
                    case 'computerName':
                        IPMaksPopupHandler.openIPMaskDialog();
                        break;
                    case 'computerMask':
                        computerMaksPopupHandler.openComputerMaskDialog();
                        break;
                    case 'IPMask':
                        IPMaksPopupHandler.openIPMaskDialog();
                        break;
                    case 'IPRange':
                        IPRangePopupHandler.openIPRangeDialog();
                        break;
                }
            };
            //===========init===================//
            initPopups()
    }
}());