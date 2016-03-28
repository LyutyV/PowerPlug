/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('DashboardView1Ctrl', ['$scope', 'Data', DashboardView1Ctrl]);


    function DashboardView1Ctrl($scope, Data) {
        var vm = this;
        vm.pageName = 'FIRSSSSTTTT';
        vm.firstName = Data.getFirstName();
        $scope.firstName = Data.getFirstName();
        $scope.$on('data_shared', function () {
            vm.firstName = Data.getFirstName();
            $scope.firstName = Data.getFirstName();
            $scope.$apply();
        });
        
    }
}());