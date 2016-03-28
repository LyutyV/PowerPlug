/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('DashboardView2Ctrl', ['$scope', DashboardView2Ctrl]);


    function DashboardView2Ctrl($scope) {
        var vm = this;
        vm.pageName = 'SECONDDDD';
        $scope.secondData = $scope.secondData * 2
    }
}());