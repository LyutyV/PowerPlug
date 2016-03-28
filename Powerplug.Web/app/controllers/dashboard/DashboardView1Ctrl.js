/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('DashboardView1Ctrl', ['$scope', 'Data', DashboardView1Ctrl]);


    function DashboardView1Ctrl($scope, Data) {
        var vm = this;
        vm.pageName = 'FIRSSSSTTTT';
        //$scope.$watch('firstData');
        //$scope.$parent.firstData = $scope.$parent.firstData * 2
        vm.firstName = Data.getFirstName();
        $scope.firstName = Data.getFirstName();
        $scope.$on('data_shared', function () {
            console.log(Data.getFirstName());
            vm.firstName = Data.getFirstName();
            $scope.firstName = Data.getFirstName();
            $scope.$apply();
        });
        
    }
}());