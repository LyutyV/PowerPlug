/// <reference

(function () {
    'use strict';

    angular
        .module('powerPlug').service('Data', function ($rootScope) {
            var data =
                {
                    FirstName: ''
                };
    
            return {
                getFirstName: function () {
                    return data.FirstName;
                },
                setFirstName: function (firstName) {
                    data.FirstName = firstName;
                    $rootScope.$broadcast('data_shared');
                }
            };
        })
        .controller('DashboardCtrl', ['$scope', 'Data', DashboardCtrl]);


    function DashboardCtrl($scope, Data) {
        var vm = this;
        vm.pageName = 'FIRSSSSTTTT';
        setTimeout(function () {
            Data.setFirstName("asdsad");
        }, 1000);
        
        
    }
}());